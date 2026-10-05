import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import type { Actor, VisualLesson } from './types';
import { Human } from './NarrativeScene';
import { LessonStill } from './LessonStill';

/** A drawing changes because the idea changes. Actors retain identity between beats. */
function LessonActor({ actor, still }: { actor: Actor; still: boolean }) {
 if (still) return <LessonStill actor={actor}/>;
 const duration = .65;
 const pose = actor.pose || {};
 const ink = actor.tone === 'faint' ? .3 : actor.tone === 'shade' ? .6 : 1;
 let shape;
 if (actor.type === 'path') shape = <motion.path initial={still ? false : { pathLength: 0 }} animate={{ d: actor.d, pathLength: 1 }} transition={{ duration: still ? 0 : 1.05, ease: 'easeInOut' }} className={actor.fill ? 'actor-filled' : ''}/>;
 else if (actor.type === 'circle') shape = <motion.circle cx={0} cy={0} animate={{ r: actor.r || 15 }} transition={{ duration }} className={actor.fill ? 'actor-filled' : ''}/>;
 else if (actor.type === 'figure') shape = <Human x={0} y={0} shade={actor.tone === 'shade'}/>;
 else if (actor.type === 'text') shape = <AnimatePresence mode="wait" initial={false}><motion.text key={actor.text} x={0} y={0} textAnchor={actor.anchor || 'start'} className="lesson-label" style={{ fontSize: actor.fontSize || 18 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: still ? 0 : .2 }}>{actor.text}</motion.text></AnimatePresence>;
 else shape = <AnimatePresence initial={false}>{actor.children?.map(child => <LessonActor key={child.id} actor={child} still={still}/>)}</AnimatePresence>;
 return <motion.g initial={still ? false : { x: actor.x || 0, y: actor.y || 0, opacity: 0 }} animate={{ x: actor.x || 0, y: actor.y || 0, rotate: pose.rotate || 0, scale: pose.scale || 1, opacity: ink * (pose.opacity ?? 1) }} exit={{ opacity: 0 }} transition={{ duration, ease: [.22, 1, .36, 1] }} className={`lesson-actor ${actor.dashed ? 'actor-dashed' : ''}`}>{shape}</motion.g>;
}

export function LessonScene({ lesson, paused = false }: { lesson: VisualLesson; paused?: boolean }) {
 const reduced = !!useReducedMotion();
 const [beat, setBeat] = useState(0);
 const elapsed = useRef(0);
 const durations = lesson.beats.map(frame => (frame.duration || 3.2) * 1000);
 const total = durations.reduce((sum, duration) => sum + duration, 0);
 useEffect(() => {
  if (paused || reduced) return;
  let raf = 0, previous = performance.now();
  function tick(now: number) {
   const delta = now - previous; previous = now;
   if (delta < 1000) elapsed.current = (elapsed.current + delta) % total;
   let remaining = elapsed.current, index = 0;
   while (index < durations.length - 1 && remaining >= durations[index]) { remaining -= durations[index]; index++; }
   setBeat(current => current === index ? current : index);
   raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
 }, [lesson, paused, reduced]);
 const selected = reduced ? lesson.beats.length - 1 : beat;
 const frame = lesson.beats[selected];
 return <div className="illustration lesson-illustration" role="img" aria-label={lesson.description} data-lesson-beat={selected}>
  <svg viewBox="0 0 400 250" fill="none" aria-hidden="true"><g className="lesson-ink" strokeLinecap="round" strokeLinejoin="round"><AnimatePresence initial={false}>{frame.actors.map(actor => <LessonActor key={actor.id} actor={actor} still={reduced}/>)}</AnimatePresence></g></svg>
  <div className="lesson-reading"><AnimatePresence mode="wait" initial={false}><motion.p key={selected} initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }} transition={{ duration: reduced ? 0 : .22 }}>{frame.caption}</motion.p></AnimatePresence></div>
  <div className="lesson-timing" aria-hidden="true">{lesson.beats.map((_, i) => <span key={i} className={i === selected ? 'current' : i < selected ? 'passed' : ''}/>)}</div>
 </div>;
}
