import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import type { Thought } from '../content/types';
import { getThinker } from '../content/library';
import { Illustration } from '../visuals/Illustration';
import { Icon } from './Icons';
import { ReadingDetails } from './ReadingDetails';
import type { LessonPlayback } from '../visuals/playback';
interface Props { card: Thought; next: Thought; index: number; total: number; saved: boolean; paused: boolean; playback: LessonPlayback; inactive: boolean; onSave: () => void; onMove: (direction: number) => void; }
export function CardStack({ card, next, index, total, saved, paused, playback, inactive, onSave, onMove }: Props) {
 const x = useMotionValue(0);
 const rotate = useTransform(x, [-350, 0, 350], [-7, 0, 7]);
 const underScale = useTransform(x, [-240, 0, 240], [1, .975, 1]);
 const underY = useTransform(x, [-240, 0, 240], [0, 7, 0]);
 const reduced = useReducedMotion();
 const [expanded, setExpanded] = useState(false);
 const details = useRef<HTMLDivElement>(null);
 const desiredExpanded = useRef(false);
 const cancelReading = useRef<(() => void) | undefined>(undefined);
 const moving = useRef(false);
 const mounted = useRef(true);
 const gesture = useRef({ active: false, x: 0, y: 0, lastX: 0, lastTime: 0, velocity: 0, axis: '' });
 useEffect(() => { mounted.current = true; return () => { mounted.current = false; cancelReading.current?.(); }; }, []);
 function interruptReading() {
  cancelReading.current?.();
  cancelReading.current = undefined;
  desiredExpanded.current = expanded;
 }
 useEffect(() => { if (inactive) interruptReading(); }, [inactive, expanded]);
 useEffect(() => {
  const interrupt = () => interruptReading();
  const key = (event: KeyboardEvent) => {
   if (['PageDown', 'PageUp', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes(event.key)) interrupt();
  };
  window.addEventListener('wheel', interrupt, { passive: true });
  window.addEventListener('keydown', key);
  return () => { window.removeEventListener('wheel', interrupt); window.removeEventListener('keydown', key); };
 }, [expanded]);
 function setReadingExpanded(next: boolean) {
  cancelReading.current?.();
  desiredExpanded.current = next;
  let cancelled = false;
  let frame = 0;
  let fallback = 0;
  const element = details.current;
  const cleanup = () => {
   cancelled = true;
   cancelAnimationFrame(frame);
   window.clearTimeout(fallback);
   element?.removeEventListener('transitionend', layoutReady);
  };
  cancelReading.current = cleanup;
  const finish = () => {
   if (cancelled || !mounted.current) return;
   cleanup();
   cancelReading.current = undefined;
   if (!next) setExpanded(false);
  };
  const scroll = () => {
   if (cancelled || !mounted.current) return;
   const body = element?.querySelector('.nuance');
   const requested = next && body ? window.scrollY + body.getBoundingClientRect().top - 20 : 0;
   const target = Math.max(0, Math.min(requested, document.documentElement.scrollHeight - window.innerHeight));
   const start = window.scrollY;
   if (reduced || Math.abs(target - start) < 1) {
    window.scrollTo({ top: target, behavior: 'instant' });
    finish();
    return;
   }
   const started = performance.now();
   const duration = Math.min(720, Math.max(420, Math.abs(target - start) * .3));
   const tick = (now: number) => {
    if (cancelled || !mounted.current) return;
    const progress = Math.min(1, (now - started) / duration);
    const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
    window.scrollTo({ top: start + (target - start) * eased, behavior: 'instant' });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else finish();
   };
   frame = requestAnimationFrame(tick);
  };
  let ready = false;
  function layoutReady(event?: TransitionEvent) {
   if (event && (event.target !== element || event.propertyName !== 'grid-template-rows')) return;
   if (ready || cancelled) return;
   ready = true;
   window.clearTimeout(fallback);
   element?.removeEventListener('transitionend', layoutReady);
   frame = requestAnimationFrame(scroll);
  }
  if (next) {
   setExpanded(true);
   if (expanded || reduced) frame = requestAnimationFrame(() => layoutReady());
   else {
    element?.addEventListener('transitionend', layoutReady);
    // Transitionend is authoritative; the fallback covers a hidden tab or disabled CSS transition.
    fallback = window.setTimeout(layoutReady, 520);
   }
  } else scroll();
 }
 function toggleReading() { setReadingExpanded(!desiredExpanded.current); }
 function settle() { if(reduced)x.set(0);else animate(x, 0, { type: 'spring', stiffness: 360, damping: 30 }); }
 function release(e: React.PointerEvent<HTMLElement>) {
  const g = gesture.current;
  if (!g.active) return;
  g.active = false;
  const delta = x.get();
  if (!g.axis && Math.hypot(e.clientX - g.x, e.clientY - g.y) < 9 && !window.getSelection()?.toString()) { toggleReading(); return; }
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
  <motion.article className="teaching-card" style={{ x, rotate: reduced ? 0 : rotate, touchAction: 'pan-y pinch-zoom' }}
   onPointerDown={e => {
    if (inactive || moving.current || !e.isPrimary || e.button !== 0 || (e.target as HTMLElement).closest('button,a,input,[data-card-control]')) return;
    gesture.current = { active: true, x: e.clientX, y: e.clientY, lastX: e.clientX, lastTime: performance.now(), velocity: 0, axis: '' };
   }}
   onPointerMove={e => {
    const g = gesture.current; if (!g.active || moving.current) return;
    const dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 9) {
     g.axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'x' : 'y';
     interruptReading();
    }
    if (g.axis !== 'x') return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    const now = performance.now();
    g.velocity = (e.clientX - g.lastX) / Math.max(1, now - g.lastTime); g.lastX = e.clientX; g.lastTime = now;
    const edge = (dx > 0 && index === 0) || (dx < 0 && index === total - 1);
    x.set(edge ? dx / (1 + Math.abs(dx) / 32) : dx * .9);
   }}
   onPointerUp={release} onPointerCancel={() => { gesture.current.active = false; settle(); }}
   data-thought-id={card.id} aria-label={`${card.title}, thought ${index + 1} of ${total}`} tabIndex={0} aria-describedby="card-interaction-hint" onKeyDown={e => { if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); toggleReading(); } }}>
   <div className="card-heading"><span className="eyebrow">{getThinker(card.thinker).name} <span className="middot">/</span> {card.concept}</span><button className={`icon-button bookmark ${saved ? 'saved' : ''}`} aria-label={saved ? 'Remove bookmark' : 'Bookmark this thought'} aria-pressed={saved} onClick={onSave}><Icon name="bookmark" size={18}/></button></div>
   <Illustration kind={card.scene.kind} caption={card.scene.caption} composition={card.scene.composition} lesson={card.scene.lesson} paused={paused} playback={playback}/>
   <div className="card-copy"><span className="concept-number">{String(index + 1).padStart(3, '0')} <span>—</span> {card.collection}</span><h1>{card.title}</h1><p className="statement">{card.statement}</p><p className="explanation">{card.explanation}</p>
    <button className={`depth-link ${expanded ? 'expanded' : ''}`} aria-expanded={expanded} aria-controls={`details-${card.id}`} onClick={() => toggleReading()}>{expanded ? 'A little less' : 'Look a little closer'}<span aria-hidden="true">{expanded ? '−' : '+'}</span></button>
    <div ref={details} id={`details-${card.id}`} className={`inline-details ${expanded ? 'is-open' : ''}`} inert={!expanded}><div className="details-inner"><ReadingDetails card={card}/><button className="fold-link" onClick={() => { setReadingExpanded(false); }}>Return to the thought ↑</button></div></div>
   </div>
   <div className="card-bottom"><span>A THOUGHTFORM</span><span className="small-cross">+</span><span>ONE THOUGHT AT A TIME</span></div>
  </motion.article>
 </div>;
}
