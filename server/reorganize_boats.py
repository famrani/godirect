#!/usr/bin/env python3
"""Reorganize recognized boat photos with gcloud; preview by default."""
import argparse,json,re,subprocess,sys
ROOT='gs://ailla-poc.appspot.com/assets/boats/'
IMAGE=re.compile(r'\.(?:jpe?g|png|webp|gif|avif|svg)$',re.I)
def destination(uri):
    if not uri.startswith(ROOT) or any(c in uri for c in ['#','*','?','[',']','\n','\r']) or '..' in uri[len(ROOT):].split('/'):
        return None
    rel=uri[len(ROOT):]
    # Legacy tenant wrapper present in the actual copied bucket listing.
    if rel.startswith('alegria_data/'):
        rel=rel[len('alegria_data/'):]
    elif rel.startswith('tenants/alegria_data/'):
        rel=rel[len('tenants/alegria_data/'):]
    # Existing boat/<id>/img layout or <id>/img layout below assets/boats.
    match=re.fullmatch(r'(?:boat/)?([A-Za-z0-9_-]+)/(?:img/)?(boat|events|home)/(.+)',rel)
    if not match or not IMAGE.search(match[3]):return None
    category={'boat':'boat','events':'outings','home':'homepage'}[match[2]]
    target=f'{ROOT}{match[1]}/{category}/{match[3]}'
    return target if target!=uri else None

def run_gcloud(args,account):
    result=subprocess.run(['gcloud',*args,'--account='+account],text=True,capture_output=True)
    if result.returncode:raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout

def metadata(uri,call):
    try:return json.loads(call(['storage','objects','describe',uri,'--format=json']))
    except RuntimeError as e:
        if re.search(r'\b404\b|not found|notfound',str(e),re.I) and not re.search(r'\b403\b|permission|forbidden',str(e),re.I):return None
        raise

def same_bytes(a,b):
    if str(a.get('size'))!=str(b.get('size')) or a.get('size') is None:return False
    for names in [('md5_hash','md5Hash'),('crc32c_hash','crc32c')]:
        left=next((a[k] for k in names if a.get(k)),None)
        right=next((b[k] for k in names if b.get(k)),None)
        if left and right:return left==right
    return False

def inspect_group(sources,call):
    versions=[]
    for source in sources:
        data=metadata(source,call)
        if not data or not data.get('generation'):
            raise RuntimeError('Source missing or generation unavailable: '+source)
        versions.append((source+'#'+str(data['generation']),data))
    reference=versions[0][1]
    if any(not same_bytes(reference,data) for _,data in versions):
        raise RuntimeError('Different or unverifiable source contents; all sources preserved: '+', '.join(sources))
    return versions

def transfer_group(sources,target,call,move=False):
    # Validate ALL duplicate sources before copying or deleting any of them.
    versions=inspect_group(sources,call)
    before=versions[0][1]
    existing=metadata(target,call)
    if existing is None:
        try:call(['storage','cp',versions[0][0],target,'--if-generation-match=0','--quiet'])
        except RuntimeError as e:
            if not re.search(r'\b412\b|conditionNotMet|precondition.*fail',str(e),re.I):raise
        existing=metadata(target,call)
    if not existing or not same_bytes(before,existing):
        raise RuntimeError('Destination differs or cannot be verified; sources preserved: '+target)
    if move:
        for pinned,data in versions:
            current=metadata(target,call)
            if not current or not same_bytes(data,current):
                raise RuntimeError('Destination changed; remaining sources preserved: '+target)
            call(['storage','rm',pinned,'--quiet'])

def transfer(source,target,call,move=False):
    transfer_group([source],target,call,move)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--account',default='alegria.boat01@gmail.com')
    parser.add_argument('--apply',action='store_true',help='Copy files, preserving originals')
    parser.add_argument('--move',action='store_true',help='With --apply, remove only verified source generations')
    args=parser.parse_args()
    if args.move and not args.apply:parser.error('--move requires --apply')
    call=lambda cmd:run_gcloud(cmd,args.account)
    listing=call(['storage','ls','--recursive',ROOT])
    objects=sorted({line.strip() for line in listing.splitlines() if line.strip().startswith(ROOT) and not line.strip().endswith(('/',':'))})
    plans=[(s,destination(s)) for s in objects if destination(s)]
    # Different old layouts must not silently compete for one destination.
    targets={}
    for source,target in plans:targets.setdefault(target,[]).append(source)
    print(f'{"MOVE" if args.move else "COPY" if args.apply else "PREVIEW"}: {len(plans)} images; {len(objects)-len(plans)} unchanged/unclassified objects')
    for source,target in plans:print(source+' -> '+target)
    failed=0
    if not args.apply:
        for target,sources in targets.items():
            if len(sources)<2:continue
            try:
                inspect_group(sources,call)
                print(f'IDENTICAL: {len(sources)} sources -> {target}')
            except RuntimeError as e:
                failed+=1;print('CONFLICT '+str(e),file=sys.stderr)
        print('Read-only preview. Add --apply to copy. Use --apply --move only after updating image references.')
        return int(failed>0)
    for target,sources in targets.items():
        try:
            transfer_group(sources,target,call,args.move)
            print(f'OK {target} ({len(sources)} sources)')
        except RuntimeError as e:failed+=1;print('FAILED '+str(e),file=sys.stderr)
    print(f'Completed {len(targets)-failed} destinations; failed {failed}. Firebase unchanged.')
    return int(failed>0)
if __name__=='__main__':
    try:sys.exit(main())
    except (RuntimeError,OSError,ValueError) as error:print(str(error),file=sys.stderr);sys.exit(1)
