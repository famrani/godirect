"use strict";
(self["webpackChunkapp"] = self["webpackChunkapp"] || []).push([["src_app_services_asset-photos_ts"],{

/***/ 19009:
/*!******************************************!*\
  !*** ./src/app/services/asset-photos.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assetPhotoPaths: () => (/* binding */ assetPhotoPaths),
/* harmony export */   editableAssetMedia: () => (/* binding */ editableAssetMedia)
/* harmony export */ });
/** Shared raw photo paths for the public pages and the CMS; never resolves URLs. */
const defaults = {
  'parking/port-antibes-parking': [1, 2, 3].map(n => `assets/parkings/port-antibes-parking/parking-${n}.jpg`),
  'property/villa-azur': [1, 2, 3].map(n => `assets/lodging/villa-azur/villa-${n}.jpg`),
  'pool/azure-pool': [1, 2, 3].map(n => `assets/pools/azure-pool/pool-${n}.jpg`)
};
function assetPhotoPaths(asset, type, id) {
  const m = asset?.media || {};
  const paths = [m.hero, m.cover, ...(Array.isArray(m.gallery) ? m.gallery : [])].filter(v => typeof v === 'string' && !!v.trim());
  if (paths.length || m.configured === true) return Array.from(new Set(paths));
  return [...(defaults[`${type}/${id}`] || [])];
}
function editableAssetMedia(asset, type, id) {
  const media = structuredClone(asset?.media || {});
  const existing = [media.hero, media.cover, ...(Array.isArray(media.gallery) ? media.gallery : [])].some(v => typeof v === 'string' && !!v.trim());
  if (!existing && media.configured !== true) {
    const paths = assetPhotoPaths(asset, type, id);
    if (paths.length) {
      media.hero = paths[0];
      media.cover = paths[0];
      media.gallery = [...paths];
    }
  }
  return media;
}

/***/ })

}]);
//# sourceMappingURL=src_app_services_asset-photos_ts.js.map