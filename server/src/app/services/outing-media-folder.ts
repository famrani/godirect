/** Storage folder aliases never change the outing's booking/URL identifier. */
export function outingMediaFolder(subject:string):string {
  const folders:Record<string,string>={'coucher-de-soleil':'sunset','journee-en-mer':'de'};
  return Object.prototype.hasOwnProperty.call(folders,subject) ? folders[subject] : subject;
}
