import {Component,Input,OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DescriptionBlock,descriptionBlocks} from '../services/listing-description';
@Component({selector:'app-listing-description',standalone:true,imports:[CommonModule],template:`
 <div class="description-copy"><ng-container *ngFor="let block of blocks" [ngSwitch]="block.kind">
 <h3 *ngSwitchCase="'heading'"><ng-container *ngTemplateOutlet="inline;context:{$implicit:block.parts}"></ng-container></h3>
 <ul *ngSwitchCase="'bullets'"><li *ngFor="let item of block.items"><ng-container *ngTemplateOutlet="inline;context:{$implicit:item}"></ng-container></li></ul>
 <ol *ngSwitchCase="'numbers'"><li *ngFor="let item of block.items"><ng-container *ngTemplateOutlet="inline;context:{$implicit:item}"></ng-container></li></ol>
 <p *ngSwitchDefault><ng-container *ngTemplateOutlet="inline;context:{$implicit:block.parts}"></ng-container></p>
 </ng-container></div>
 <ng-template #inline let-parts><ng-container *ngFor="let part of parts"><strong *ngIf="part.bold;else plain">{{part.text}}</strong><ng-template #plain>{{part.text}}</ng-template></ng-container></ng-template>`,styles:[`
 :host{display:block;min-width:0}.description-copy{max-width:72ch;font-size:18px;line-height:1.8;color:inherit;overflow-wrap:anywhere;text-align:left}
 p{margin:0 0 1.2em;white-space:pre-line}h3{font-size:23px;line-height:1.35;margin:1.6em 0 .6em;font-weight:700}h3:first-child{margin-top:0}
 ul,ol{margin:.5em 0 1.3em;padding-left:1.5em}li{padding-left:.2em;margin:.45em 0;white-space:pre-line}strong{font-weight:800;color:inherit}
 @media(max-width:600px){.description-copy{font-size:17px;line-height:1.75}h3{font-size:21px}}
 `]})
export class ListingDescriptionComponent implements OnChanges{
 @Input() text='';blocks:DescriptionBlock[]=[];
 ngOnChanges(){this.blocks=descriptionBlocks(this.text);}
}
