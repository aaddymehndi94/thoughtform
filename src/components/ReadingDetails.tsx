import type { Thought } from '../content/types';
import { sources } from '../content/sources';
export function ReadingDetails({ card }: { card: Thought }) {
 return <div className="reading-details"><p className="nuance">{card.nuance}</p>{card.reflection && <div className="reflection"><span className="eyebrow">A question to sit with</span><p>{card.reflection}</p></div>}<div className="source-list"><span className="eyebrow">Reading behind this thought</span>{card.sources.map(id => sources[id] && <a key={id} href={sources[id].url} target="_blank" rel="noreferrer"><span>{sources[id].author} · {sources[id].title} ↗</span><small>{sources[id].reference}</small><small>Read an institutional introduction</small></a>)}<small className="paraphrase-note">Original paraphrase, not a quotation. Jung’s model is a way of interpreting psychic life.</small></div></div>;
}
