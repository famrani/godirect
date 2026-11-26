import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, UrlTree } from '@angular/router';
import { internalAssetUrl, externalAssetUrl } from './asset-domain';
@Injectable()
export class AssetUrlSerializer extends DefaultUrlSerializer {
 override parse(url:string):UrlTree{return super.parse(/^\/(?:[?#]|$)/.test(url)?url:internalAssetUrl(url));}
 override serialize(tree:UrlTree):string{return externalAssetUrl(super.serialize(tree));}
}
