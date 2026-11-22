import {prebookingText} from './prebooking-text';
import {messagingText} from './messaging-text';
const COPY:Record<string,string[]>={
 fr:['Réservation','Échanges avec le propriétaire','Échanges avec le client','Échanges avec le concierge','Vous échangez avec le propriétaire et les concierges habilités pour cette réservation.','Vous échangez avec le client. Le propriétaire et les concierges habilités ont accès à cette conversation.','Vous échangez avec le propriétaire.','Vous échangez avec le concierge. Le propriétaire a également accès à cet échange.','Client, propriétaire et concierge sélectionné.','Rechercher un bien ou une conversation','Choisissez une conversation'],
 en:['Reservation','Conversation with the owner','Conversation with the customer','Conversation with the concierge','You are speaking with the owner and authorized concierges for this reservation.','You are speaking with the customer. The owner and authorized concierges can access this conversation.','You are speaking with the owner.','You are speaking with the concierge. The owner can also access this conversation.','Customer, owner and selected concierge.','Search an asset or conversation','Choose a conversation'],
 es:['Reserva','Conversación con el propietario','Conversación con el cliente','Conversación con el conserje','Habla con el propietario y los conserjes autorizados para esta reserva.','Habla con el cliente. El propietario y los conserjes autorizados tienen acceso a esta conversación.','Habla con el propietario.','Habla con el conserje. El propietario también tiene acceso a esta conversación.','Cliente, propietario y conserje seleccionado.','Buscar un bien o una conversación','Elija una conversación'],
 it:['Prenotazione','Conversazione con il proprietario','Conversazione con il cliente','Conversazione con il concierge','Parli con il proprietario e i concierge autorizzati per questa prenotazione.','Parli con il cliente. Il proprietario e i concierge autorizzati possono accedere alla conversazione.','Parli con il proprietario.','Parli con il concierge. Anche il proprietario può accedere alla conversazione.','Cliente, proprietario e concierge selezionato.','Cerca un bene o una conversazione','Scegli una conversazione'],
 de:['Buchung','Gespräch mit dem Eigentümer','Gespräch mit dem Kunden','Gespräch mit dem Concierge','Sie sprechen mit dem Eigentümer und den für diese Buchung autorisierten Betreuern.','Sie sprechen mit dem Kunden. Der Eigentümer und autorisierte Betreuer haben Zugriff.','Sie sprechen mit dem Eigentümer.','Sie sprechen mit dem Concierge. Der Eigentümer hat ebenfalls Zugriff.','Kunde, Eigentümer und ausgewählter Concierge.','Objekt oder Gespräch suchen','Gespräch auswählen'],
 nl:['Boeking','Gesprek met de eigenaar','Gesprek met de klant','Gesprek met de conciërge','U spreekt met de eigenaar en de bevoegde beheerders voor deze boeking.','U spreekt met de klant. De eigenaar en bevoegde beheerders hebben toegang.','U spreekt met de eigenaar.','U spreekt met de conciërge. De eigenaar heeft ook toegang tot dit gesprek.','Klant, eigenaar en geselecteerde conciërge.','Zoek een object of gesprek','Kies een gesprek'],
 ru:['Бронирование','Переписка с владельцем','Переписка с клиентом','Переписка с консьержем','Вы общаетесь с владельцем и уполномоченными консьержами по этому бронированию.','Вы общаетесь с клиентом. Владелец и уполномоченные консьержи имеют доступ к переписке.','Вы общаетесь с владельцем.','Вы общаетесь с консьержем. Владелец также имеет доступ к переписке.','Клиент, владелец и выбранный консьерж.','Поиск объекта или переписки','Выберите переписку']};
export function presentationText(language:string,index:number){return (COPY[language]||COPY.en)[index];}
export function clientInConversation(thread:any,uid:string):boolean{return !!uid&&thread?.audience==='rental'&&thread.customerId===uid;}
export function conversationLabel(thread:any,uid:string,language:string):string {
 const client=clientInConversation(thread,uid),text=(i:number)=>presentationText(language,i);let prefix='';
 if(thread.kind==='subscription')prefix=messagingText(language,7);
 else if(thread.kind==='asset')prefix=(thread.prebooking?prebookingText(language,thread.linkedBookingId?16:1)+' · ':'')+(client?text(thread.recipientRole==='concierge'?3:1):text(2));
 else if(thread.audience==='rental')prefix=text(0)+' · '+text(client?1:2);
 else prefix=messagingText(language,6);
 const parts=[prefix,String(thread.assetName||'')];
 // The booking's title is the customer's name: never repeat it to that customer.
 if(!client&&thread.title)parts.push(String(thread.title));
 if(client&&thread.kind==='asset'&&thread.recipientName)parts.push(String(thread.recipientName));
 const period=thread.bookingContext||thread.prebooking;if(period?.startAt&&period?.endAt){const a=new Date(period.startAt),b=new Date(period.endAt);if(Number.isFinite(a.getTime())&&Number.isFinite(b.getTime())){const languageCode=['fr','en','es','it','de','nl','ru'].includes(language)?language:'en';const format=new Intl.DateTimeFormat(languageCode,{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});parts.push(format.format(a)+' → '+format.format(b));}}return parts.filter(Boolean).join(' — ');
}
export function conversationAudience(thread:any,uid:string,language:string):string {
 const client=clientInConversation(thread,uid);
 if(thread?.kind==='asset')return presentationText(language,client?(thread.recipientRole==='concierge'?7:6):8);
 if(thread?.audience==='rental')return presentationText(language,client?4:5);
 return messagingText(language,21);
}
