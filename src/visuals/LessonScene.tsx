import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Actor, VisualLesson } from './types';
import { Human } from './NarrativeScene';
import { LessonStill } from './LessonStill';
import { LessonControls } from './LessonControls';
import type { LessonPlayback } from './playback';

const LESSON_DWELL_MULTIPLIER = 2;

/** A drawing changes because the idea changes. Actors retain identity between beats. */
function LessonActor({ actor, still, speed }: { actor: Actor; still: boolean; speed: number }) {
 if (still) return <LessonStill actor={actor}/>;
 const duration = .65 / speed;
 const pose = actor.pose || {};
 const ink = actor.tone === 'faint' ? .3 : actor.tone === 'shade' ? .6 : 1;
 let shape;
 // Motion draws solid paths with a dash mask. Dashed paths keep their authored
 // pattern and reveal through opacity so the mask cannot replace their meaning.
 if (actor.type === 'path') shape = actor.dashed
  ? <motion.path key="dashed" d={actor.d} strokeDasharray="3 5" initial={{ opacity: 0 }} animate={{ d: actor.d, opacity: 1 }} transition={{ duration: 1.05 / speed, ease: 'easeInOut' }} className={actor.fill ? 'actor-filled' : ''}/>
  : <motion.path key="drawn" d={actor.d} initial={{ pathLength: 0 }} animate={{ d: actor.d, pathLength: 1 }} transition={{ duration: 1.05 / speed, ease: 'easeInOut' }} className={actor.fill ? 'actor-filled' : ''}/>;
 else if (actor.type === 'circle') shape = <motion.circle cx={0} cy={0} r={actor.r || 15} animate={{ r: actor.r || 15 }} transition={{ duration }} className={actor.fill ? 'actor-filled' : ''}/>;
 else if (actor.type === 'figure') shape = <Human x={0} y={0} shade={actor.tone === 'shade'} facing={actor.facing}/>;
 else if (actor.type === 'text') shape = <AnimatePresence mode="wait" initial={false}><motion.text key={actor.text} x={0} y={0} textAnchor={actor.anchor || 'start'} className="lesson-label" style={{ fontSize: actor.fontSize || 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 / speed }}>{actor.text}</motion.text></AnimatePresence>;
 else shape = <AnimatePresence initial={false}>{actor.children?.map(child => <LessonActor key={child.id} actor={child} still={still} speed={speed}/>)}</AnimatePresence>;
 return <motion.g initial={still ? false : { x: actor.x || 0, y: actor.y || 0, originX: 0, originY: 0, opacity: 0 }} animate={{ x: actor.x || 0, y: actor.y || 0, rotate: pose.rotate || 0, scale: pose.scale || 1, originX: 0, originY: 0, opacity: ink * (pose.opacity ?? 1) }} exit={{ opacity: 0 }} transition={{ duration, ease: [.22, 1, .36, 1] }} style={{ transformBox: 'view-box' }} className={`lesson-actor ${actor.dashed ? 'actor-dashed' : ''}`}>{shape}</motion.g>;
}

export function LessonScene({ lesson, paused = false, playback }: { lesson: VisualLesson; paused?: boolean; playback?: LessonPlayback }) {
 const reduced = !!useReducedMotion();
 const speed = playback?.speed ?? 1;
 const manual = paused || reduced;
 const [beat, setBeat] = useState(reduced ? lesson.beats.length - 1 : 0);
 const [settingsOpen, setSettingsOpen] = useState(false);
 const elapsed = useRef(0);
 const beatIndex = useRef(beat);
 const gesture = useRef({ active: false, x: 0, y: 0, axis: '' });
 const durations = useMemo(() => lesson.beats.map(frame => (frame.duration || 3.2) * LESSON_DWELL_MULTIPLIER * 1000), [lesson]);
 const total = durations.reduce((sum, duration) => sum + duration, 0);
 useEffect(() => {
  if (!reduced) return;
  const last = lesson.beats.length - 1;
  beatIndex.current = last; setBeat(last);
  elapsed.current = durations.slice(0, last).reduce((sum, duration) => sum + duration, 0);
 }, [reduced, lesson, durations]);
 useEffect(() => {
  if (manual || settingsOpen) return;
  let raf = 0, previous = performance.now();
  function tick(now: number) {
   const delta = now - previous; previous = now;
   if (delta < 1000) elapsed.current = (elapsed.current + delta * speed) % total;
   let remaining = elapsed.current, index = 0;
   while (index < durations.length - 1 && remaining >= durations[index]) { remaining -= durations[index]; index++; }
   if (beatIndex.current !== index) { beatIndex.current = index; setBeat(index); }
   raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
 }, [lesson, manual, settingsOpen, speed, total, durations]);
 function step(direction: number) {
  const next = Math.max(0, Math.min(lesson.beats.length - 1, beatIndex.current + direction));
  if (next === beatIndex.current) return;
  beatIndex.current = next;
  elapsed.current = durations.slice(0, next).reduce((sum, duration) => sum + duration, 0);
  setBeat(next);
 }
 const selected = beat;
 const frame = lesson.beats[selected];
 return <div className="illustration lesson-illustration" role="group" aria-label={manual ? 'Illustrated lesson. Use left and right arrow keys to change stages.' : 'Illustrated lesson'} data-lesson-beat={selected} data-card-control={manual ? '' : undefined} tabIndex={manual ? 0 : undefined}
  onKeyDown={event => { if (manual && event.target === event.currentTarget && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); event.stopPropagation(); step(event.key === 'ArrowRight' ? 1 : -1); } }}
  onPointerDown={event => {
   if (!manual || settingsOpen || !event.isPrimary || event.button !== 0 || (event.target as HTMLElement).closest('button,a,input')) return;
   gesture.current = { active: true, x: event.clientX, y: event.clientY, axis: '' };
  }}
  onPointerMove={event => {
   const g = gesture.current; if (!g.active) return;
   const dx = event.clientX - g.x, dy = event.clientY - g.y;
   if (!g.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 9) g.axis = Math.abs(dx) > Math.abs(dy) * 1.3 ? 'x' : 'y';
   if (g.axis === 'x' && !event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerUp={event => {
   const g = gesture.current; if (!g.active) return; g.active = false;
   const dx = event.clientX - g.x, dy = event.clientY - g.y;
   if (g.axis === 'x' && Math.abs(dx) > 35) step(dx < 0 ? 1 : -1);
   else if (!g.axis && Math.hypot(dx, dy) < 9) { const r = event.currentTarget.getBoundingClientRect(); step(event.clientX < r.left + r.width / 2 ? -1 : 1); }
   if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }}
  onPointerCancel={() => { gesture.current.active = false; }}>
  <svg viewBox="0 0 400 250" fill="none" role="img" aria-label={lesson.description}><g className="lesson-ink" strokeLinecap="round" strokeLinejoin="round"><AnimatePresence initial={false}>{frame.actors.map(actor => <LessonActor key={actor.id} actor={actor} still={reduced} speed={speed}/>)}</AnimatePresence></g></svg>
  <div className="lesson-reading" aria-live={manual ? 'polite' : 'off'} aria-atomic="true"><AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} transition={{ duration: reduced ? 0 : .22 / speed }}>{frame.caption}</motion.p></AnimatePresence></div>
  <LessonControls beat={selected} count={lesson.beats.length} manual={manual} reduced={reduced} open={settingsOpen} onOpenChange={setSettingsOpen} onStep={step} playback={playback}/>
 </div>;
}
