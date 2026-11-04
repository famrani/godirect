export class UtilsService {
  requiredEnv(name: string): string {
    const value = process.env[name]?.trim();
    if (!value) throw new Error(`${name} is missing`);
    return value;
  }
  nowIso(): string { return new Date().toISOString(); }
  values<T>(value: unknown): T[] { return Object.values((value ?? {}) as Record<string, T>); }
}
