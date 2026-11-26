export const PORTAL_HOSTS = ['owner', 'client', 'concierge', 'admin', 'www'];
export function portalFor(host) {
    const h = String(host || '').toLowerCase().replace(/:\d+$/, '').replace(/\.$/, '');
    if (h === 'godirect.fr' || h === 'www.godirect.fr' || h === 'owner.godirect.fr')
        return 'owner';
    if (h === 'client.godirect.fr')
        return 'client';
    if (h === 'concierge.godirect.fr')
        return 'concierge';
    if (h === 'admin.godirect.fr')
        return 'admin';
    return /^[a-z0-9-]+\.godirect\.fr$/.test(h) ? 'asset' : 'local';
}
export function workspacePortal(path) {
    const p = path.split(/[?#]/)[0];
    if (/^\/(platform\/admin|admin-access)(\/|$)/.test(p))
        return 'admin';
    if (/^\/concierge(\/|$)/.test(p))
        return 'concierge';
    if (/^\/owner(\/|$)/.test(p))
        return 'owner';
    return null;
}
export function portalOrigin(portal) { return `https://${portal}.godirect.fr`; }

//# sourceMappingURL=portal-policy.js.map
