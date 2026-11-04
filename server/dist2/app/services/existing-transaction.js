/**
 * Firebase can invoke a transaction with null when its local cache is empty.
 * Returning undefined there aborts before Firebase can retry with server data.
 * Return null only for that empty candidate: Firebase compares its hash and
 * retries with the server value if the node exists. Never seed from a stale read.
 * A genuinely missing node stays missing and is NOT reported as an update.
 */
export async function updateExisting(ref, update) {
    const result = await ref.transaction((current) => current === null ? null : update(current), undefined, false);
    const missing = result.snapshot.val() === null;
    return { ...result, committed: result.committed && !missing, missing };
}

//# sourceMappingURL=existing-transaction.js.map
