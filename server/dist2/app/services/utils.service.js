export class UtilsService {
    requiredEnv(name) {
        const value = process.env[name]?.trim();
        if (!value)
            throw new Error(`${name} is missing`);
        return value;
    }
    nowIso() { return new Date().toISOString(); }
    values(value) { return Object.values((value ?? {})); }
}

//# sourceMappingURL=utils.service.js.map
