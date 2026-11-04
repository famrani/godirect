/** Storage folder aliases never change the outing's booking/URL identifier. */
export function outingMediaFolder(subject) {
    const folders = { 'coucher-de-soleil': 'sunset', 'journee-en-mer': 'de' };
    return Object.prototype.hasOwnProperty.call(folders, subject) ? folders[subject] : subject;
}

//# sourceMappingURL=outing-media-folder.js.map
