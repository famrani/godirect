/** URL context always takes precedence over the remembered management preference. */
export function assetView(url:string, canManage:boolean, preferred:'admin'|'customer'):'admin'|'customer' {
 if(!canManage)return 'customer';
 const parts=url.split(/[?#]/)[0].split('/').filter(Boolean);
 const section=parts.length>=3?parts[2]:parts[0];
 if(section==='admin'||(section==='owner'&&parts[3]==='payments'))return 'admin';
 if(!section||section==='home')return preferred;
 return 'customer';
}
