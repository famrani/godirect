import {Component,Input,Output,EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ListingDescriptionComponent} from './listing-description.component';
import {DescriptionFormat,formatDescription} from '../services/listing-description';
const COPY:Record<string,string[]>={
 fr:['Titre','Gras','Liste à puces','Liste numérotée','Paragraphe','Aperçu','Description','Votre texte','Sélectionnez du texte, puis utilisez les boutons pour le mettre en forme.','La description ne peut pas dépasser 10 000 caractères.'],
 en:['Heading','Bold','Bullet list','Numbered list','Paragraph','Preview','Description','Your text','Select text, then use the buttons to format it.','The description cannot exceed 10,000 characters.'],
 es:['Título','Negrita','Lista con viñetas','Lista numerada','Párrafo','Vista previa','Descripción','Su texto','Seleccione texto y utilice los botones para darle formato.','La descripción no puede superar los 10 000 caracteres.'],
 it:['Titolo','Grassetto','Elenco puntato','Elenco numerato','Paragrafo','Anteprima','Descrizione','Il tuo testo','Seleziona il testo e usa i pulsanti per formattarlo.','La descrizione non può superare 10.000 caratteri.'],
 de:['Überschrift','Fett','Aufzählung','Nummerierte Liste','Absatz','Vorschau','Beschreibung','Ihr Text','Text auswählen und mit den Schaltflächen formatieren.','Die Beschreibung darf 10.000 Zeichen nicht überschreiten.'],
 nl:['Kop','Vet','Opsomming','Genummerde lijst','Alinea','Voorbeeld','Beschrijving','Uw tekst','Selecteer tekst en gebruik de knoppen om deze op te maken.','De beschrijving mag niet langer zijn dan 10.000 tekens.'],
 ru:['Заголовок','Жирный','Маркированный список','Нумерованный список','Абзац','Предпросмотр','Описание','Ваш текст','Выделите текст и используйте кнопки форматирования.','Описание не может превышать 10 000 символов.']
};
@Component({selector:'app-listing-description-editor',standalone:true,imports:[CommonModule,ListingDescriptionComponent],template:`
 <div class="editor"><div class="toolbar" role="group" [attr.aria-label]="t(6)">
 <button type="button" *ngFor="let kind of formats;let i=index" (mousedown)="$event.preventDefault()" (click)="format(input,kind)" [disabled]="disabled">{{t(i)}}</button>
 <button type="button" (click)="preview=!preview" [attr.aria-pressed]="preview">{{t(5)}}</button></div>
 <p class="hint">{{t(8)}}</p>
 <textarea #input [id]="inputId" [value]="value" (input)="changed(input.value)" [placeholder]="placeholder" [disabled]="disabled" [attr.aria-label]="t(6)" maxlength="10000" rows="12"></textarea>
 <p class="counter">{{value.length}} / 10 000</p><p *ngIf="error" role="alert">{{t(9)}}</p>
 <section *ngIf="preview" class="preview"><h4>{{t(5)}}</h4><app-listing-description [text]="value"></app-listing-description></section></div>`,styles:[`
 :host{display:block;width:100%;min-width:0}.editor{border:1px solid #aac3cd;border-radius:12px;background:white;overflow:hidden}.toolbar{display:flex;flex-wrap:wrap;gap:7px;padding:10px;background:#edf4f5}
 button{border:1px solid #c6d8df;border-radius:6px;padding:8px 11px;background:white;color:#153b46;font:600 14px/1.3 Arial,sans-serif;cursor:pointer}button:focus-visible,textarea:focus-visible{outline:3px solid #b47a22;outline-offset:-3px}button[aria-pressed=true]{background:#153b46;color:white}button:disabled{opacity:.5}
 textarea{display:block;box-sizing:border-box;width:100%;min-height:260px;resize:vertical;border:0;border-top:1px solid #dbe5e9;padding:16px;font:17px/1.7 Arial,sans-serif;color:#153b46;background:white;border-radius:0}.hint,.counter{font-size:13px;line-height:1.5;margin:8px 12px;color:#526b80}.counter{text-align:right}.preview{border-top:1px solid #dbe5e9;padding:20px}h4{margin:0 0 18px;font-size:16px;color:#526b80}
 `]})
export class ListingDescriptionEditorComponent {
 @Input() value='';@Input() lang='fr';@Input() placeholder='';@Input() inputId='listing-description';@Input() disabled=false;
 @Output() valueChange=new EventEmitter<string>();
 preview=true;error=false;readonly formats:DescriptionFormat[]=['heading','bold','bullets','numbers','paragraph'];
 t(i:number){return (COPY[this.lang]||COPY.en)[i];}
 changed(value:string){this.error=value.length>10000;if(!this.error){this.value=value;this.valueChange.emit(value);}}
 format(input:HTMLTextAreaElement,kind:DescriptionFormat){
  const result=formatDescription(this.value,input.selectionStart,input.selectionEnd,kind,this.t(7));
  if(result.value.length>10000){this.error=true;return;}
  this.changed(result.value);input.value=result.value;input.focus();input.setSelectionRange(result.start,result.end);
 }
}
