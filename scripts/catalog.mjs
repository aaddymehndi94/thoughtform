import { readFile, readdir, writeFile } from 'node:fs/promises';
const root = new URL('../src/content/', import.meta.url);
const items = [], sources = {}, cards = JSON.parse(await readFile(new URL('opening.json', root), 'utf8'));
for (const filename of (await readdir(new URL('library/',root))).filter(f=>f.endsWith('.json')).sort()) {
 if(!['jung','jung-advanced','nietzsche','freud','frankl'].includes(filename.replace(/(-sources)?\.json$/,'')))continue;
 const data=JSON.parse(await readFile(new URL(`library/${filename}`,root),'utf8'));
 if(filename.endsWith('-sources.json'))Object.assign(sources,data);
 else for(const card of data) {
  cards.push(card);
  items.push({id:card.id,thinker:card.thinker,collection:card.collection,concept:card.concept,title:card.title,tags:card.tags,depth:card.depth});
 }
}
const ids = new Set();
function checkActors(actors, location) {
 const siblings = new Set();
 for(const actor of actors) {
  if(!actor || typeof actor !== 'object' || !['path','circle','figure','text','group'].includes(actor.type))throw new Error(`${location}: invalid drawing actor`);
  if(!actor.id || siblings.has(actor.id))throw new Error(`${location}: missing or duplicate actor ID ${actor.id}`);
  siblings.add(actor.id);
  if(actor.type === 'group')checkActors(actor.children || [], `${location}/${actor.id}`);
 }
}
for(const card of cards) {
 if(!card.id || ids.has(card.id))throw new Error(`Missing or duplicate thought ID: ${card.id}`);
 ids.add(card.id);
 if(card.nuance?.split(/\n\s*\n/).length !== 3 || card.readingArt?.length !== 2)throw new Error(`${card.id}: expected three reading paragraphs and two explanatory drawings`);
 const beats=card.scene?.lesson?.beats;
 if(!beats || beats.length < 3 || beats.length > 5)throw new Error(`${card.id}: expected a staged teaching lesson`);
 beats.forEach((beat, i) => {
  if(!beat.caption || !Array.isArray(beat.actors))throw new Error(`${card.id}, beat ${i}: missing teaching caption or drawing`);
  checkActors(beat.actors, `${card.id}, beat ${i}`);
 });
 card.readingArt.forEach((drawing, i) => checkActors(drawing.actors, `${card.id}, reading drawing ${i}`));
}
for(const card of cards)for(const related of card.related || [])if(!ids.has(related))throw new Error(`${card.id}: unavailable related thought ${related}`);
await writeFile(new URL('catalog.json',root),JSON.stringify(items,null,2)+'\n');
await writeFile(new URL('source-library.json',root),JSON.stringify(sources,null,2)+'\n');
console.log(`Validated ${cards.length} unique thoughts; indexed ${items.length} additional thoughts across ${new Set(items.map(c=>c.thinker)).size} thinkers.`);
