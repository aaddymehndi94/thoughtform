import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
const root=process.cwd(),out=resolve(root,'artifacts/lesson-review');await mkdir(out,{recursive:true});
const entry=`import React from 'react';import {renderToStaticMarkup} from 'react-dom/server';import {LessonStill} from '${root}/src/visuals/LessonStill';export function render(actors){return renderToStaticMarkup(<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250" fill="none"><style>{'.lesson-label{fill:#c8c2b7;stroke:none;font-family:DejaVu Sans,sans-serif}.human-body{fill:#141411}.human-contour{opacity:.6}.human-hatch{opacity:.6}'}</style><rect width="400" height="250" fill="#111110"/><g stroke="#d0cabe" strokeWidth="1.45" strokeLinecap="round" strokeLinejoin="round">{actors.map(actor=><LessonStill key={actor.id} actor={actor}/>)}</g></svg>);}`;
await build({stdin:{contents:entry,loader:'tsx',resolveDir:root},bundle:true,platform:'node',format:'cjs',packages:'external',outfile:resolve(out,'renderer.cjs')});
const {render}=createRequire(import.meta.url)(resolve(out,'renderer.cjs'));
const files=['opening.json','library/jung.json','library/jung-advanced.json','library/nietzsche.json','library/freud.json','library/frankl.json'];let report=[];
for(const file of files){const cards=JSON.parse(await readFile(resolve(root,'src/content',file),'utf8'));for(const card of cards){if(!card.scene.lesson)continue;const dir=resolve(out,card.thinker);await mkdir(dir,{recursive:true});for(let i=0;i<card.scene.lesson.beats.length;i++){const beat=card.scene.lesson.beats[i],path=resolve(dir,`${card.id}-${i}.svg`);await writeFile(path,render(beat.actors));report.push({id:card.id,thinker:card.thinker,title:card.title,index:i,caption:beat.caption,svg:path});}}}
await writeFile(resolve(out,'index.json'),JSON.stringify(report,null,2));console.log(`Rendered ${report.length} explanatory beats as SVG.`);
