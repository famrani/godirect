export function documentRouteParam(req, name) { const value = req.params[name]; if (typeof value !== 'string' || !/^[a-zA-Z0-9_-]{1,160}$/.test(value) || ['__proto__', 'constructor', 'prototype'].includes(value))
    throw Object.assign(Error('invalid_legal_parameter'), { status: 400 }); return value; }

//# sourceMappingURL=legal-route-param.js.map
