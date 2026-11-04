import {SiteLanguage} from './language.service';
export const BOAT_OUTINGS_TEXT:Record<SiteLanguage,Record<string,string>>={
 fr:{title:'Sorties et expériences',intro:'Consultez et modifiez les formules proposées sur le site.',catalog:'Catalogue des sorties',catalogText:'Voir les sorties proposées aux clients.',edit:'Gérer les sorties',editText:'Modifier les textes, photos et présentations des sorties.',operations:'Navigations et journal de bord',operationsText:'Suivre les navigations réalisées, les checklists et le journal de bord.'},
 en:{title:'Trips and experiences',intro:'View and edit the experiences offered on the website.',catalog:'Trip catalogue',catalogText:'View the trips offered to customers.',edit:'Manage trips',editText:'Edit trip descriptions, photos and presentations.',operations:'Sailing and logbook',operationsText:'Track completed sailings, checklists and the logbook.'},
 es:{title:'Salidas y experiencias',intro:'Consulta y edita las experiencias ofrecidas en el sitio.',catalog:'Catálogo de salidas',catalogText:'Ver las salidas ofrecidas a los clientes.',edit:'Gestionar salidas',editText:'Editar textos, fotos y presentaciones de las salidas.',operations:'Navegaciones y diario de a bordo',operationsText:'Seguir navegaciones realizadas, listas de control y diario de a bordo.'},
 it:{title:'Escursioni ed esperienze',intro:'Consulta e modifica le esperienze offerte sul sito.',catalog:'Catalogo escursioni',catalogText:'Vedi le escursioni offerte ai clienti.',edit:'Gestisci escursioni',editText:'Modifica testi, foto e presentazioni delle escursioni.',operations:'Navigazioni e diario di bordo',operationsText:'Segui navigazioni effettuate, checklist e diario di bordo.'},
 de:{title:'Ausflüge und Erlebnisse',intro:'Die auf der Website angebotenen Ausflüge ansehen und bearbeiten.',catalog:'Ausflugskatalog',catalogText:'Die angebotenen Kundenausflüge ansehen.',edit:'Ausflüge verwalten',editText:'Texte, Fotos und Beschreibungen der Ausflüge bearbeiten.',operations:'Fahrten und Logbuch',operationsText:'Durchgeführte Fahrten, Checklisten und Logbuch verfolgen.'},
 nl:{title:'Vaartochten en ervaringen',intro:'Bekijk en bewerk de ervaringen op de website.',catalog:'Catalogus vaartochten',catalogText:'Bekijk de vaartochten die klanten kunnen boeken.',edit:'Vaartochten beheren',editText:'Bewerk teksten, foto’s en presentaties van vaartochten.',operations:'Vaarten en logboek',operationsText:'Volg uitgevoerde vaarten, checklists en het logboek.'},
 ru:{title:'Прогулки и впечатления',intro:'Просматривайте и изменяйте предложения на сайте.',catalog:'Каталог прогулок',catalogText:'Посмотреть прогулки, предлагаемые клиентам.',edit:'Управлять прогулками',editText:'Изменить тексты, фотографии и описания прогулок.',operations:'Плавания и судовой журнал',operationsText:'Отслеживать выполненные плавания, проверки и судовой журнал.'},
};
export function boatOutingsGroup(language:SiteLanguage,translate:(key:string,fallback:string)=>string){
 const t=(key:string)=>translate('ui.boatOutings.'+key,BOAT_OUTINGS_TEXT[language][key]);
 return {id:'outings',icon:'⛵',title:t('title'),text:t('intro'),items:[
  {title:t('catalog'),text:t('catalogText'),route:'/sorties'},
  {title:t('edit'),text:t('editText'),route:'/admin/site-content',queryParams:{tab:'outings'}},
 ]};
}
const languages:SiteLanguage[]=['fr','en','es','it','de','nl','ru'];
/** Reconcile the scoped catalogue into the CMS draft without mutating either source. */
export function hydrateBoatOutings(content:any,records:any,boatId:string):any {
 const site=structuredClone(content||{});
 const entries=Object.entries<any>(records||{}).filter(([,r])=>r&&typeof r==='object'&&(!r.boatId||r.boatId===boatId)&&(!r.assetId||r.assetId===boatId)&&(!r.assetType||r.assetType==='boat'));
 for(const language of languages){
  const draft=site[language]??={};const rows=new Map<string,any>();
  const existing=Array.isArray(draft.outings)?draft.outings:[];
  for(const [key,r]of entries){
   const slug=String(r.slug||r.id||key);const common:Record<string,any>={};
   for(const field of ['image','gallery','category','priceFrom','active','title','description','duration','guests','highlights'])if(r[field]!==undefined)common[field]=structuredClone(r[field]);
   const localized=r[language]&&typeof r[language]==='object'?r[language]:{};
   rows.set(slug,{...common,...structuredClone(localized),slug});
  }
  for(const r of existing){if(!r?.slug)continue;rows.set(String(r.slug),{...(rows.get(String(r.slug))||{}),...structuredClone(r)});}
  draft.outings=Array.from(rows.values());
 }
 return site;
}
