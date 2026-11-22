import {Component} from '@angular/core';
import {ActivatedRoute,Router,RouterModule} from '@angular/router';

@Component({
 selector:'app-admin-access',standalone:true,imports:[RouterModule],
 template:`<main style="max-width:760px;margin:48px auto;padding:24px">
 <h1>Accès à l’administration interrompu</h1>
 <p role="alert">{{message}}</p>
 <p>Code de diagnostic : <strong>{{reason}}</strong></p>
 <p>Le contrôle d’accès reste actif. Aucune donnée n’a été modifiée.</p>
 <button type="button" (click)="retry()" [disabled]="busy">Réessayer</button>
 <p><a routerLink="/account/login">Se connecter</a> · <a routerLink="/">Accueil GoDirect</a></p>
 </main>`
})
export class AdminAccessComponent {
 busy=false;
 constructor(private route:ActivatedRoute,private router:Router){}
 get reason():string {
  const value=this.route.snapshot.queryParamMap.get('reason')||'';
  return /^(session_unavailable|session_mismatch|admin_required|authentication_required|request_timeout|network_unavailable|session_check_failed|http_\d{3})$/.test(value)?value:'session_check_failed';
 }
 get message():string {
  const messages:Record<string,string>={
   session_unavailable:'La session de connexion n’est pas encore disponible. Connectez-vous ou réessayez.',
   session_mismatch:'La session a changé pendant le contrôle. Réessayez avec le compte administrateur.',
   admin_required:'Le serveur n’a pas confirmé le droit administrateur pour cette session.',
   authentication_required:'Le serveur a refusé la session. Reconnectez-vous puis réessayez.',
   request_timeout:'Le serveur n’a pas répondu au contrôle administrateur dans le délai prévu.',
   network_unavailable:'Le navigateur n’a pas pu joindre le serveur pour vérifier vos droits.',
   session_check_failed:'La vérification de la session a échoué avant de pouvoir confirmer vos droits.'
  };
  return messages[this.reason]||'Le serveur a renvoyé une erreur pendant le contrôle administrateur.';
 }
 async retry():Promise<void>{
  if(this.busy)return;
  this.busy=true;
  const value=this.route.snapshot.queryParamMap.get('returnUrl')||'';
  const target=/^\/platform\/admin(?:\/|\?|$)/.test(value)?value:'/platform/admin/notifications';
  try{await this.router.navigateByUrl(target);}finally{this.busy=false;}
 }
}
