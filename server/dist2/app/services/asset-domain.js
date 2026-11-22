export function domainAssetId(host) {
    const hostname = String(host || '').toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
    const match = /^([a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\.godirect\.fr$/.exec(hostname);
    return match && match[1] !== 'www' ? match[1] : null;
}
export function hostnameMatches(pattern, host) {
    if (pattern === host)
        return true;
    return pattern === '*.godirect.fr' && domainAssetId(host) !== null;
}

//# sourceMappingURL=asset-domain.js.map
