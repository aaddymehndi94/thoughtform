import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const GUIDE_KEY = 'thoughtform.reading-guide.seen';
export function needsReadingGuide() {
 try { return localStorage.getItem(GUIDE_KEY) !== 'true'; }
 catch { return true; }
}

function Gesture({ direction }: { direction: 'previous' | 'next' | 'tap' }) {
 const tap = direction === 'tap';
 return <svg viewBox="0 0 84 72" aria-hidden="true">
  {tap ? <circle className="guide-contact" cx="39" cy="12" r="12"/> :
   <path className="guide-trail" d={direction === 'previous' ? 'M14 20h48m-7-6 7 6-7 6' : 'M70 20H22m7-6-7 6 7 6'}/>}
  <g transform="translate(34 13)"><g className={`guide-hand guide-hand-${direction}`}>
   <path d="M0 24V5C0-2 9-2 9 5v14l3-5c2-3 6-1 6 2l3-2c3-2 6 0 6 3l3-1c3-1 6 1 6 5v12c0 6-4 12-7 15H13L4 37c-3-4-8-8-7-11 1-3 4-3 7 0"/>
  </g></g>
 </svg>;
}

export function ReadingGuide({ onDismiss }: { onDismiss: () => void }) {
 const reduced = useReducedMotion();
 useEffect(() => {
  try { localStorage.setItem(GUIDE_KEY, 'true'); } catch {}
  // The cues are transparent to input: the first interaction also works normally.
  const pointer = (event: PointerEvent) => { if (event.isPrimary && event.button === 0) onDismiss(); };
  const key = (event: KeyboardEvent) => {
   if (['Escape', 'Enter', ' ', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(event.key)) onDismiss();
  };
  document.addEventListener('pointerdown', pointer, { capture: true, passive: true });
  document.addEventListener('keydown', key, true);
  return () => {
   document.removeEventListener('pointerdown', pointer, true);
   document.removeEventListener('keydown', key, true);
  };
 }, [onDismiss]);
 return <motion.aside className="reading-guide" aria-label="Reading gestures" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
  exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .4, ease: [.22, 1, .36, 1] }}>
  <span className="guide-cue"><Gesture direction="previous"/><span>Swipe right<small>Previous</small></span></span>
  <span className="guide-cue guide-cue-tap"><Gesture direction="tap"/><span>Tap<small>Read more</small></span></span>
  <span className="guide-cue"><Gesture direction="next"/><span>Swipe left<small>Next</small></span></span>
 </motion.aside>;
}
