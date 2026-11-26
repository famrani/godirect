import {AfterViewInit,Component,ElementRef,Input,Output,EventEmitter,ViewChild} from '@angular/core';
import {Router} from '@angular/router';
@Component({standalone:true,selector:'app-admin-success',template:`<dialog #box aria-labelledby="approval-title" (cancel)="$event.preventDefault();back()"><h2 id="approval-title">{{message}}</h2><button type="button" autofocus (click)="back()">Retour à la liste des biens</button></dialog>`,styles:[`dialog{max-width:min(26rem,85vw);border:1px solid #c9dcd6;border-radius:16px;padding:1.6rem;color:#173e39;box-shadow:0 16px 60px #173e3933}dialog::backdrop{background:#0e292880}h2{margin:0 0 1.2rem;font-size:1.3rem}button{background:#175348;color:white;border:0;border-radius:9px;padding:.8rem 1rem;font:inherit;cursor:pointer}`]})
export class AdminSuccessComponent implements AfterViewInit{
 @Output() dismissed=new EventEmitter<void>();@Input() message='';@ViewChild('box',{static:true}) box!:ElementRef<HTMLDialogElement>;
 constructor(private router:Router){} ngAfterViewInit(){this.box.nativeElement.showModal();}
 async back(){this.box.nativeElement.close();this.dismissed.emit();await this.router.navigate(['/platform/admin'],{queryParams:{tab:'assets'}});}
}
