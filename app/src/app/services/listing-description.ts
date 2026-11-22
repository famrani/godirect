export interface DescriptionPart {text:string;bold:boolean;}
export interface DescriptionBlock {kind:'paragraph'|'heading'|'bullets'|'numbers';parts:DescriptionPart[];items:DescriptionPart[][];}
export function descriptionParts(text:string):DescriptionPart[]{
 const parts:DescriptionPart[]=[];let from=0;const pattern=/\*\*([^*\n]+)\*\*/g;let match:RegExpExecArray|null;
 while((match=pattern.exec(text))){if(match.index>from)parts.push({text:text.slice(from,match.index),bold:false});parts.push({text:match[1],bold:true});from=match.index+match[0].length;}
 if(from<text.length)parts.push({text:text.slice(from),bold:false});return parts;
}
// Existing imported text is only divided visually. No words or facts are added.
function readableParagraphs(text:string):string[]{
 if(text.length<550)return [text];
 const sentences=text.split(/(?<=[.!?])\s+(?=[A-ZÀ-ÖØ-ÞА-Я])/u);
 const result:string[]=[];let current='';
 for(const sentence of sentences){
  if(current&&current.length+sentence.length>480){result.push(current);current='';}
  if(sentence.length>700){
   if(current){result.push(current);current='';}
   let chunk='';for(const word of sentence.split(/\s+/)){if(chunk&&chunk.length+word.length>480){result.push(chunk);chunk='';}chunk+=(chunk?' ':'')+word;}current=chunk;
  }else current+=(current?' ':'')+sentence;
 }
 if(current)result.push(current);return result;
}
export function descriptionBlocks(value:unknown):DescriptionBlock[]{
 const blocks:DescriptionBlock[]=[];let paragraph:string[]=[];
 const flush=()=>{if(paragraph.length){for(const p of readableParagraphs(paragraph.join('\n')))blocks.push({kind:'paragraph',parts:descriptionParts(p),items:[]});paragraph=[];}};
 for(const line of String(value||'').replace(/\r\n?/g,'\n').split('\n')){
  const text=line.trim();if(!text){flush();continue;}
  const heading=/^#{1,3}\s+(.+)$/.exec(text);
  if(heading){flush();blocks.push({kind:'heading',parts:descriptionParts(heading[1]),items:[]});continue;}
  const bullet=/^[-*•]\s+(.+)$/.exec(text),number=/^\d+[.)]\s+(.+)$/.exec(text);
  if(bullet||number){flush();const kind=bullet?'bullets':'numbers';let block=blocks[blocks.length-1];if(block?.kind!==kind){block={kind,parts:[],items:[]};blocks.push(block);}block.items.push(descriptionParts((bullet||number)![1]));continue;}
  paragraph.push(line.trimEnd());
 }
 flush();return blocks;
}
export type DescriptionFormat='heading'|'bold'|'bullets'|'numbers'|'paragraph';
export function formatDescription(value:string,start:number,end:number,format:DescriptionFormat,placeholder:string):{value:string;start:number;end:number}{
 if(format==='bold'){const text=value.slice(start,end)||placeholder;const added='**'+text+'**';return {value:value.slice(0,start)+added+value.slice(end),start:start+2,end:start+2+text.length};}
 if(format==='paragraph'){const added='\n\n';return {value:value.slice(0,start)+added+value.slice(start),start:start+2,end:start+2};}
 const a=start===0?0:value.lastIndexOf('\n',start-1)+1;
 const next=value.indexOf('\n',Math.max(start,end-1)),b=next<0?value.length:next;
 const text=value.slice(a,b)||placeholder;
 const added=text.split('\n').map((line,i)=>{
  const clean=line.replace(/^(?:#{1,3}\s+|[-*•]\s+|\d+[.)]\s+)/,'');
  return (format==='heading'?'## ':format==='numbers'?(i+1)+'. ':'- ')+clean;
 }).join('\n');
 return {value:value.slice(0,a)+added+value.slice(b),start:a,end:a+added.length};
}

export function descriptionPlainText(value:unknown):string{return descriptionBlocks(value).map(block=>block.kind==='bullets'||block.kind==='numbers'?block.items.map(parts=>parts.map(p=>p.text).join('')).join(' '):block.parts.map(p=>p.text).join('')).join(' ');}
