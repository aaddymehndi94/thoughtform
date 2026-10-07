import { useEffect, useState } from 'react';
import type { Source, Thought } from '../content/types';
import { MarginDrawing } from '../visuals/CompositionScene';
import { sources as openingSources, loadSources } from '../content/sources';
export function ReadingDetails({ card }: { card: Thought }) {
 const [sources,setSources]=useState<Record<string,Source>>(openingSources);
 const [sourceError,setSourceError]=useState(false);
 useEffect(()=>{let active=true;setSourceError(false);loadSources(card.thinker).then(loaded=>{if(active)setSources(loaded);}).catch(()=>{if(active)setSourceError(true);});return()=>{active=false;};},[card.thinker]);
 return <div className="reading-details">{card.nuance.split('\n\n').map((text, i) => <div className="reading-paragraph" key={i}><p className="nuance">{text}</p>{card.readingArt?.[i] && <MarginDrawing composition={card.readingArt[i]}/>}</div>)}{card.reflection && <div className="reflection"><span className="eyebrow">A question to sit with</span><p>{card.reflection}</p></div>}<div className="source-list"><span className="eyebrow">Reading behind this thought</span>{card.sources.map(id => sources[id] && <a key={id} href={sources[id].url} target="_blank" rel="noreferrer"><span>{sources[id].author} · {sources[id].title} ↗</span><small>{sources[id].reference}</small><small>Read the source and context</small></a>)}{sourceError&&<button className="source-retry" onClick={()=>window.location.reload()}>Reload to read the references ↻</button>}<small className="paraphrase-note">Original paraphrase, not a quotation. These readings introduce an author’s ideas, including their tensions and limits.</small></div></div>;
}
