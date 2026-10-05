import type { Thought } from '../content/types';
import { MarginDrawing } from '../visuals/CompositionScene';
import { sources } from '../content/sources';
export function ReadingDetails({ card }: { card: Thought }) {
 return <div className="reading-details">{card.nuance.split('\n\n').map((text, i) => <div className="reading-paragraph" key={i}><p className="nuance">{text}</p>{card.readingArt?.[i] && <MarginDrawing composition={card.readingArt[i]}/>}</div>)}{card.reflection && <div className="reflection"><span className="eyebrow">A question to sit with</span><p>{card.reflection}</p></div>}<div className="source-list"><span className="eyebrow">Reading behind this thought</span>{card.sources.map(id => sources[id] && <a key={id} href={sources[id].url} target="_blank" rel="noreferrer"><span>{sources[id].author} · {sources[id].title} ↗</span><small>{sources[id].reference}</small><small>Read the source and context</small></a>)}<small className="paraphrase-note">Original paraphrase, not a quotation. These readings introduce an author’s ideas, including their tensions and limits.</small></div></div>;
}
