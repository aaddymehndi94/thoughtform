import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import type { Thought } from '../content/types';
import { Illustration } from '../visuals/Illustration';
import { Icon } from './Icons';
import { ReadingDetails } from './ReadingDetails';
interface Props { card: Thought; next: Thought; index: number; total: number; saved: boolean; onSave: () => void; onMove: (direction: number) => void; }
export function CardStack({ card, next, index, total, saved, onSave, onMove }: Props) {
 const x = useMotionValue(0);
 const rotate = useTransform(x, [-350, 0, 350], [-7, 0, 7]);
 const underScale = useTransform(x, [-240, 0, 240], [1, .975, 1]);
 const underY = useTransform(x, [-240, 0, 240], [0, 7, 0]);
 const reduced = useReducedMotion();
 const [expanded, setExpanded] = useState(false);
 const moving = useRef(false);
 const mounted = useRef(true);
 const gesture = useRef({ active: false, x: 0, y: 0, lastX: 0, lastTime: 0, velocity: 0, axis: '' });
 useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
 function settle() { animate(x, 0, { type: 'spring', stiffness: 360, damping: 30 }); }
 function release(e: React.PointerEvent<HTMLElement>) {
  const g = gesture.current;
  if (!g.active) return;
  g.active = false;
  const delta = x.get();
  if (!g.axis && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 9 && !window.getSelection()?.toString()) { setExpanded(value => !value); return; }
  const velocity = performance.now() - g.lastTime < 100 ? g.velocity : 0;
  const direction = delta < 0 ? 1 : -1;
  const atEdge = (direction < 0 && index === 0) || (direction > 0 && index === total - 1);
  if (g.axis === 'x' && !atEdge && (Math.abs(delta) > 82 || (Math.abs(delta) > 24 && Math.abs(velocity) > .55 && Math.sign(velocity) === Math.sign(delta)))) {
   moving.current = true;
   animate(x, direction * -560, { duration: reduced ? 0 : .23, ease: [.32, .05, .67, 1] }).then(() => { if (mounted.current) onMove(direction); });
  } else settle();
  if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  g.axis = '';
 }
 return <div className="stack"><span id="card-interaction-hint" className="sr-only">Tap anywhere on the thought or press Enter to expand the reading. Tap again to collapse. Swipe left for the next thought and right for the previous thought.</span>
  <motion.div className="under-card" style={{ scale: underScale, y: underY }} aria-hidden="true"><span>{next.title}</span></motion.div>
  <motion.article className="teaching-card" style={{ x, rotate: reduced ? 0 : rotate }}
   onPointerDown={e => {
    if (moving.current || e.button !== 0 || (e.target as HTMLElement).closest('button,a,input')) return;
    gesture.current = { active: true, x: e.clientX, y: e.clientY, lastX: e.clientX, lastTime: performance.now(), velocity: 0, axis: '' };
   }}
   onPointerMove={e => {
    const g = gesture.current; if (!g.active || moving.current) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 9) g.axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'x' : 'y';
    if (g.axis !== 'x') return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    g.velocity = (e.clientX - g.lastX) / Math.max(1, now - g.lastTime); g.lastX = e.clientX; g.lastTime = now;
    const edge = (dx > 0 && index === 0) || (dx < 0 && index === total - 1);
    x.set(edge ? dx / (1 + Math.abs(dx) / 32) : dx * .9);
   }}
   onPointerUp={release} onPointerCancel={() => { gesture.current.active = false; settle(); }}
   aria-label={`${card.title}, thought ${index + 1} of ${total}`} tabIndex={0} aria-describedby="card-interaction-hint" onKeyDown={e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setExpanded(value => !value); } }}>
   <div className="card-heading"><span className="eyebrow">Carl Jung <span className="middot">/</span> {card.concept}</span><button className={`icon-button bookmark ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Bookmark this thought'} aria-pressed={saved} onClick={onSave}><Icon name="bookmark" size={18}/></button></div>
   <Illustration kind={card.scene.kind} caption={card.scene.caption}/>
   <div className="card-copy"><span className="concept-number">{String(index + 1).padStart(3, '0')} <span>—</span> {card.collection}</span><h1>{card.title}</h1><p className="statement">{card.statement}</p><p className="explanation">{card.explanation}</p>
    <button className={`depth-link ${expanded ? 'expanded' : ''}`} aria-expanded={expanded} aria-controls={`details-${card.id}`} onClick={() => setExpanded(value => !value)}>{expanded ? 'A little less' : 'Look a little closer'}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div id={`details-${card.id}`} className={`inline-details ${expanded ? 'is-open' : ''}`} inert={!expanded}><div className="details-inner"><ReadingDetails card={card}/><button className="fold-link" onClick={() => { setExpanded(false); document.querySelector('article')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' }); }}>Return to the thought ↑</button></div></div>
   </div>
   <div className="card-bottom"><span>AN INNER INDEX</span><span className="small-cross">+</span><span>ONE THOUGHT AT A TIME</span></div>
  </motion.article>
 </div>;
}
