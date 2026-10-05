import { useEffect, useRef, useState } from 'react';
import { cards as opening } from './content/cards';
import { getThinker, indexEntries, loadThinker } from './content/library';
import type { Thought } from './content/types';
import { CardStack } from './components/CardStack';
import { Icon } from './components/Icons';
import { Library } from './components/Library';
const KEY='thoughtform.v1';
interface ReadingState { current?: string; bookmarks?: string[]; viewed?: string[]; paused?: boolean; collection?: string; }
function readState():ReadingState{try{return JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('inner-index.v1')||'{}');}catch{return {};}}
const initial=readState();
const initialId=decodeURIComponent(location.hash.slice(1))||initial.current||opening[0].id;
export default function App(){
 const [flow,setFlow]=useState<Thought[]>(opening); const [activeId,setActiveId]=useState(opening.find(c=>c.id===initialId)?.id||opening[0].id);
 const [bookmarks,setBookmarks]=useState<string[]>(Array.isArray(initial.bookmarks)?initial.bookmarks.filter(v=>typeof v==='string'):[]);
 const [viewed,setViewed]=useState<string[]>(Array.isArray(initial.viewed)?initial.viewed.filter(v=>typeof v==='string'):[]);
 const [panel,setPanel]=useState(false); const [paused,setPaused]=useState(!!initial.paused); const [busy,setBusy]=useState(false);
 const [thread,setThread]=useState<string|undefined>(); const [error,setError]=useState('');
 const request=useRef(0); const ready=useRef(false);
 const index=Math.max(0,flow.findIndex(c=>c.id===activeId)); const card=flow[index];
 async function choose(id:string,collection?:string,close=true){
  const entry=indexEntries.find(c=>c.id===id);if(!entry)return;
  const ticket=++request.current;setBusy(true);setError('');
  try{const all=await loadThinker(entry.thinker);if(ticket!==request.current)return;
   const selected=collection?all.filter(c=>c.collection===collection):all;
   if(!selected.length)throw new Error('This collection could not open.');
   setFlow(selected);setActiveId(selected.some(c=>c.id===id)?id:selected[0].id);setThread(collection);if(close)setPanel(false);window.scrollTo({top:0,behavior:'instant'});
  }catch{setError('The collection could not open. Please try again.');}finally{if(ticket===request.current){setBusy(false);ready.current=true;}}
 }
 useEffect(()=>{void choose(initialId,initial.collection,false);},[]);
 function move(direction:number){const next=flow[Math.max(0,Math.min(flow.length-1,index+direction))];if(next.id===card.id)return;setActiveId(next.id);window.scrollTo({top:0,behavior:'instant'});}
 useEffect(()=>{setViewed(v=>v.includes(card.id)?v:[...v,card.id]);},[card.id]);
 useEffect(()=>{if(!ready.current)return;try{localStorage.setItem(KEY,JSON.stringify({current:card.id,bookmarks,viewed,paused,collection:thread}));history.replaceState(null,'',`#${encodeURIComponent(card.id)}`);}catch{}},[card.id,bookmarks,viewed,paused,thread,busy]);
 useEffect(()=>{function key(e:KeyboardEvent){if(e.key==='Escape')setPanel(false);if(panel||(e.target as HTMLElement).matches('input,textarea,select'))return;if(e.key==='ArrowRight'){e.preventDefault();move(1);}if(e.key==='ArrowLeft'){e.preventDefault();move(-1);}}window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);},[panel,flow,index]);
 useEffect(()=>{if(panel){const y=window.scrollY;document.body.style.position='fixed';document.body.style.top=`-${y}px`;document.body.style.width='100%';return()=>{document.body.style.position='';document.body.style.top='';document.body.style.width='';window.scrollTo(0,y);};}},[panel]);
 function save(){setBookmarks(b=>b.includes(card.id)?b.filter(id=>id!==card.id):[...b,card.id]);}
 const thinker=getThinker(card.thinker);
 return <div className={`app ${paused?'paused':''}`}><header className="site-header"><button className="wordmark" onClick={()=>setPanel(true)} aria-label="Open thoughtform library"><span className="monogram">tf</span><span>thoughtform<span className="wordmark-dot">.</span></span></button><span className="header-note">A FIELD GUIDE TO THE INNER WORLD</span><button className="library-button" onClick={()=>setPanel(true)}><span>The index</span><Icon name="index" size={18}/></button></header>
 <main><div className="reading-label"><span className="live-dot"/><button className="collection-label" onClick={()=>setPanel(true)}>{thinker.label} <span>/</span> {thread||'The collection'}</button><span className="label-rule"/><span className="position-label">{String(index+1).padStart(2,'0')} / {String(flow.length).padStart(2,'0')}</span></div>{error&&<p role="alert" className="loading-note">{error}</p>}<div className="reading-stage"><button className="side-nav previous" aria-label="Previous thought" onClick={()=>move(-1)} disabled={index===0}><Icon name="arrow-left"/></button><CardStack key={card.id} card={card} next={flow[Math.min(index+1,flow.length-1)]} index={index} total={flow.length} saved={bookmarks.includes(card.id)} onSave={save} onMove={move}/><button className="side-nav next" aria-label="Next thought" onClick={()=>move(1)} disabled={index===flow.length-1}><Icon name="arrow-right"/></button></div>
 <nav className="flow-nav" aria-label="Thought navigation"><button onClick={()=>move(-1)} disabled={index===0} aria-label="Previous thought"><Icon name="arrow-left" size={18}/></button><span className="swipe-hint">{index===flow.length-1?'A place to pause.':'Swipe. Let a thought stay.'}</span><button onClick={()=>move(1)} disabled={index===flow.length-1} aria-label="Next thought"><Icon name="arrow-right" size={18}/></button></nav><div className="progress-track" role="progressbar" aria-label="Position in collection" aria-valuemin={1} aria-valuemax={flow.length} aria-valuenow={index+1}><span style={{width:`${((index+1)/flow.length)*100}%`}}/></div>
 </main><footer className="site-footer"><span>Difficult ideas. Slowly understood.</span><button className="motion-control" onClick={()=>setPaused(p=>!p)} aria-label={paused?'Play illustrations':'Pause illustrations'}><Icon name={paused?'play':'pause'} size={13}/><span>{paused?'Resume motion':'A little stillness'}</span></button><span className="footer-edition">{thinker.years} <span>·</span> {thinker.name.toUpperCase()}</span></footer>
 {panel&&<Library current={card.id} bookmarks={bookmarks} viewed={viewed} busy={busy} onClose={()=>setPanel(false)} onChoose={(id,collection)=>void choose(id,collection)}/>}
 <div className="sr-only" aria-live="polite">Thought {index+1} of {flow.length}: {card.title}</div></div>;
}
