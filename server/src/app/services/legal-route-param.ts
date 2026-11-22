import type {Request} from 'express';
export function documentRouteParam(req:Pick<Request,'params'>,name:string):string{const value=req.params[name];if(typeof value!=='string'||!/^[a-zA-Z0-9_-]{1,160}$/.test(value)||['__proto__','constructor','prototype'].includes(value))throw Object.assign(Error('invalid_legal_parameter'),{status:400});return value;}
