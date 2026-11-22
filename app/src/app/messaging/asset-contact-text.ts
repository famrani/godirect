const COPY:Record<string,string[]>={fr:['Contacter l’hôte','Votre interlocuteur','Propriétaire','Concierge','Tous mes messages','Échange au sujet de ce bien','Ouverture de la conversation…'],en:['Contact your host','Your contact','Owner','Concierge','All my messages','Conversation about this asset','Opening conversation…'],es:['Contactar al anfitrión','Tu contacto','Propietario','Conserje','Todos mis mensajes','Conversación sobre este bien','Abriendo conversación…'],it:['Contatta il tuo host','Il tuo contatto','Proprietario','Concierge','Tutti i miei messaggi','Conversazione su questo bene','Apertura conversazione…'],de:['Gastgeber kontaktieren','Ihre Kontaktperson','Eigentümer','Concierge','Alle Nachrichten','Gespräch zu diesem Objekt','Gespräch wird geöffnet…'],nl:['Contact met de verhuurder','Uw contactpersoon','Eigenaar','Conciërge','Al mijn berichten','Gesprek over dit object','Gesprek openen…'],ru:['Связаться с хозяином','Ваш собеседник','Владелец','Консьерж','Все сообщения','Переписка об этом объекте','Открытие переписки…']};
export function assetContactText(language:string,i:number){return (COPY[language]||COPY.en)[i];}
/** No remembered/default asset: a platform page must not accidentally contact Alegria. */
export function assetContactScope(url:string,dedicated:{assetType:string;assetId:string}|null):{assetType:string;assetId:string}|null {
 const path=url.split(/[?#]/)[0];const m=/^\/(boat|car|property|parking|pool)\/([a-z0-9][a-z0-9_-]*)(?:\/|$)/i.exec(path);
 if(m)return {assetType:m[1].toLowerCase(),assetId:m[2]};
 if(/^\/(messages|account|owner|platform|concierge|legal|faq|contact|asset-calendar|admin-access|__asset_unavailable)(?:\/|$)/.test(path))return null;
 return dedicated;
}
