import { cards as opening } from './cards';
import entries from './catalog.json';
import type { Thought } from './types';
export interface Thinker { id: string; name: string; label: string; years: string; description: string; }
export const thinkers: Thinker[] = [
 {id:'jung',name:'Carl Jung',label:'Jung',years:'1875–1961',description:'The life beneath the life we know.'},
 {id:'nietzsche',name:'Friedrich Nietzsche',label:'Nietzsche',years:'1844–1900',description:'How a value becomes a question.'},
 {id:'freud',name:'Sigmund Freud',label:'Freud',years:'1856–1939',description:'The desires that speak indirectly.'},
 {id:'adler',name:'Alfred Adler',label:'Adler',years:'1870–1937',description:'The private logic of belonging.'},
 {id:'frankl',name:'Viktor Frankl',label:'Frankl',years:'1905–1997',description:'A life answering its circumstances.'},
 {id:'kierkegaard',name:'Søren Kierkegaard',label:'Kierkegaard',years:'1813–1855',description:'The difficulty of becoming a self.'},
 {id:'dostoevsky',name:'Fyodor Dostoevsky',label:'Dostoevsky',years:'1821–1881',description:'Contradiction, conscience, and freedom.'},
 {id:'weil',name:'Simone Weil',label:'Weil',years:'1909–1943',description:'Attention without possession.'},
 {id:'krishnamurti',name:'J. Krishnamurti',label:'Krishnamurti',years:'1895–1986',description:'Looking before the mind names.'},
 {id:'watts',name:'Alan Watts',label:'Watts',years:'1915–1973',description:'The strange work of being alive.'},
];
export type IndexEntry = Pick<Thought,'id'|'thinker'|'collection'|'concept'|'title'|'tags'|'depth'>;
export const indexEntries: IndexEntry[] = [...opening.map(({id,thinker,collection,concept,title,tags,depth})=>({id,thinker,collection,concept,title,tags,depth})),...entries] as IndexEntry[];
const loaders = import.meta.glob<Thought[]>(['./library/jung.json','./library/jung-advanced.json','./library/nietzsche.json','./library/freud.json','./library/frankl.json'],{import:'default'});
const cache = new Map<string,Promise<Thought[]>>();
export function loadThinker(id: string): Promise<Thought[]> {
 if(!cache.has(id))cache.set(id,(async()=>{const load=loaders[`./library/${id}.json`];const additional=load?await load():[];const advanced=id==='jung'&&loaders['./library/jung-advanced.json']?await loaders['./library/jung-advanced.json']():[];return id==='jung'?[...opening,...additional,...advanced]:additional;})());
 return cache.get(id)!;
}
export function getThinker(id:string){return thinkers.find(t=>t.id===id)||thinkers[0];}
export const availableThinkers=thinkers.filter(t=>indexEntries.some(c=>c.thinker===t.id));
