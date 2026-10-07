import { useEffect, useRef, useState } from 'react';
import { availableThinkers, getThinker, indexEntries } from '../content/library';
import type { IndexEntry } from '../content/library';
import { Icon } from './Icons';
interface Props { current: string; bookmarks: string[]; viewed: string[]; readingPlaces: Record<string,string>; busy: boolean; onClose: () => void; onChoose: (id: string, collection?: string) => void; }
export function Library({ current, bookmarks, viewed, readingPlaces, busy, onClose, onChoose }: Props) {
 const dialog=useRef<HTMLDialogElement>(null);
 const [query,setQuery]=useState(''); const [thinker,setThinker]=useState<string|null>(null); const [tab,setTab]=useState<'thinkers'|'saved'>('thinkers');
 useEffect(()=>{dialog.current?.showModal();},[]);
 const search=query.trim().toLowerCase();
 const entries=indexEntries.filter(c=>(!thinker||c.thinker===thinker)&&(tab!=='saved'||bookmarks.includes(c.id))&&(!search||`${c.title} ${c.concept} ${c.collection} ${getThinker(c.thinker).name} ${c.tags.join(' ')}`.toLowerCase().includes(search)));
 function row(c:IndexEntry,i:number){return <button key={c.id} className={`index-row ${c.id===current?'current':''}`} onClick={()=>onChoose(c.id)} disabled={busy}><span className="index-number">{String(i+1).padStart(2,'0')}</span><span>{c.title}<small>{search||tab==='saved'?`${getThinker(c.thinker).label} · `:''}{c.concept}</small></span><span className="index-marker">{bookmarks.includes(c.id)?<Icon name="bookmark" size={13}/>:viewed.includes(c.id)?'·':''}</span></button>;}
 const collections=[...new Set(entries.map(c=>c.collection))];
 const beginning=thinker?indexEntries.find(c=>c.thinker===thinker):undefined;
 const place=thinker?indexEntries.find(c=>c.id===readingPlaces[thinker]&&c.thinker===thinker):undefined;
 return <dialog aria-label="Explore the thoughtform library" className="library-dialog" ref={dialog} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget)onClose();}}><section className="detail-panel"><div className="panel-top"><span className="eyebrow">THOUGHTFORM / THE INDEX</span><button className="icon-button" onClick={onClose} aria-label="Close the index"><Icon name="close"/></button></div>
 <h2>{thinker?getThinker(thinker).name:'Many ways inward.'}</h2><p className="index-intro">{thinker?getThinker(thinker).description:'A thinker. A question. Somewhere to begin.'}</p>
 <label className="search-field"><span className="sr-only">Search thoughts and thinkers</span><input type="search" placeholder="Find a thought…" value={query} onChange={e=>setQuery(e.target.value)}/><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg></label>
 <div className="library-tabs"><button aria-pressed={tab==='thinkers'} onClick={()=>{setTab('thinkers');setThinker(null);}}>The thinkers <span>{availableThinkers.length}</span></button><button aria-pressed={tab==='saved'} onClick={()=>{setTab('saved');setThinker(null);}}>Kept thoughts <span>{bookmarks.length}</span></button></div>
 {thinker&&<button className="library-back" onClick={()=>setThinker(null)}>← All thinkers</button>}
 {beginning&&!search&&tab==='thinkers'&&<div className="author-reading">{place&&place.id!==beginning.id&&<button onClick={()=>onChoose(place.id)} disabled={busy}><span>Continue reading</span><strong>{place.title} ↗</strong></button>}<button onClick={()=>onChoose(beginning.id)} disabled={busy}>Read from the beginning <span aria-hidden="true">→</span></button><p>Follow the whole collection, or begin with a thread below.</p></div>}
 {busy&&<p className="loading-note" role="status">Opening the collection…</p>}
 <div className="index-list">{!search&&!thinker&&tab==='thinkers'?availableThinkers.map(t=><button key={t.id} className="thinker-row" onClick={()=>setThinker(t.id)}><span className="thinker-initial">{t.label.charAt(0)}</span><span>{t.name}<small>{t.description}</small></span><span className="thinker-count">{indexEntries.filter(c=>c.thinker===t.id).length}<span>↗</span></span></button>):thinker&&!search&&tab==='thinkers'?collections.map(name=><div className="collection-group" key={name}><button className="collection-heading" onClick={()=>onChoose(entries.find(c=>c.collection===name)!.id,name)}><span>{name}</span><span>Read this thread ↗</span></button>{entries.filter(c=>c.collection===name).map(row)}</div>):entries.map(row)}</div>
 {!entries.length&&<p className="empty-library">{tab==='saved'&&!search?'Keep a thought with the small bookmark in its corner. It will wait here for you.':'No thoughts found. Try another word.'}</p>}
 <p className="library-footnote">{indexEntries.length} thoughts. No hurry.</p></section></dialog>;
}
