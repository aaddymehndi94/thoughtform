import { readFile, readdir, writeFile } from 'node:fs/promises';
const root = new URL('../src/content/', import.meta.url);
const items = [], sources = {};
for (const filename of (await readdir(new URL('library/',root))).filter(f=>f.endsWith('.json')).sort()) {
 if(!['jung','nietzsche','freud','frankl'].includes(filename.replace(/(-sources)?\.json$/,'')))continue;
 const data=JSON.parse(await readFile(new URL(`library/${filename}`,root),'utf8'));
 if(filename.endsWith('-sources.json'))Object.assign(sources,data);
 else for(const card of data)items.push({id:card.id,thinker:card.thinker,collection:card.collection,concept:card.concept,title:card.title,tags:card.tags,depth:card.depth});
}
await writeFile(new URL('catalog.json',root),JSON.stringify(items,null,2)+'\n');
await writeFile(new URL('source-library.json',root),JSON.stringify(sources,null,2)+'\n');
console.log(`Indexed ${items.length} additional thoughts across ${new Set(items.map(c=>c.thinker)).size} thinkers.`);
