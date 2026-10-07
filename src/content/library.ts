import { cards as opening } from './cards';
import entries from './catalog.json';
import registry from './thinkers.json';
import { cardLoaders } from './loaders';
import type { Thought } from './types';
export interface Thinker { id: string; name: string; label: string; years: string; description: string; files: string[]; }
export const thinkers: Thinker[] = registry;
export type IndexEntry = Pick<Thought,'id'|'thinker'|'collection'|'concept'|'title'|'tags'|'depth'>;
export const indexEntries: IndexEntry[] = [...opening.map(({id,thinker,collection,concept,title,tags,depth})=>({id,thinker,collection,concept,title,tags,depth})),...entries] as IndexEntry[];
const cache = new Map<string,Promise<Thought[]>>();
export function loadThinker(id: string): Promise<Thought[]> {
 if(!cache.has(id))cache.set(id,(async()=>{const thinker=thinkers.find(t=>t.id===id);if(!thinker)throw new Error('Unknown thinker');const batches=await Promise.all(thinker.files.map(file=>{const load=cardLoaders[file];if(!load)throw new Error(`Unavailable collection: ${file}`);return load();}));return [...(id==='jung'?opening:[]),...batches.flat()];})().catch(error=>{cache.delete(id);throw error;}));
 return cache.get(id)!;
}
export function getThinker(id:string){return thinkers.find(t=>t.id===id)||thinkers[0];}
export const availableThinkers=thinkers.filter(t=>indexEntries.some(c=>c.thinker===t.id));
