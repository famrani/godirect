export function prefixQuery(value:string):string{return String(value||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,63).replace(/-$/,'');}
export function prefixQueryReady(value:string):boolean{return (prefixQuery(value).match(/[a-z]/g)||[]).length>=6;}
export function prefixSelectionValid(prefix:string,choices:string[]):boolean{return !!prefix&&choices.includes(prefix);}
