import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const GUIDE_KEY = 'thoughtform.reading-guide.seen';

export function needsReadingGuide() {
 try { return localStorage.getItem(GUIDE_KEY) !== 'true'; }
 catch { return true; }
}

function TouchHand({ className }: { className: string }) {
 return <g className={className} fill="#121211" stroke="#d5d0c5" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round">
  <path d="M0 24V5C0-2 9-2 9 5v14l3-5c2-3 6-1 6 2l3-2c3-2 6 0 6 3l3-1c3-1 6 1 6 5v12c0 6-4 12-7 15H13L4 37c-3-4-8-8-7-11 1-3 4-3 7 0"/>
 </g>;
}

function SwipeDrawing() {
 return <svg className="guide-swipe-drawing" viewBox="0 0 280 130" aria-hidden="true">
  <defs><clipPath id="guide-swipe-window"><rect x="24" y="2" width="232" height="110"/></clipPath></defs>
  <g clipPath="url(#guide-swipe-window)">
   <g className="guide-thought guide-thought-next"><rect x="69" y="8" width="142" height="96" rx="3"/><text x="87" y="35">02</text><path d="M88 54h86m-86 13h105m-105 13h63"/></g>
   <g className="guide-thought guide-thought-first"><rect x="69" y="8" width="142" height="96" rx="3"/><text x="87" y="35">01</text><path d="M88 54h104m-104 13h77m-77 13h92"/></g>
  </g>
  <path className="guide-swipe-trace guide-swipe-left" d="M170 64H98m7-5-7 5 7 5" fill="none" stroke="#aaa69d" strokeWidth="1"/>
  <path className="guide-swipe-trace guide-swipe-right" d="M98 64h72m-7-5 7 5-7 5" fill="none" stroke="#aaa69d" strokeWidth="1"/>
  <g transform="translate(168 58)"><TouchHand className="guide-swipe-hand"/></g>
 </svg>;
}

function TapDrawing() {
 return <svg className="guide-tap-drawing" viewBox="0 0 280 130" aria-hidden="true">
  <g className="guide-reading-sheet"><rect x="69" y="4" width="142" height="112" rx="3"/></g>
  <g className="guide-reading-lines" fill="none" stroke="#aaa69d" strokeWidth="1.4" strokeLinecap="round">
   <path d="M88 24h77m-77 14h103"/>
   <path className="guide-more-lines" d="M88 62h96m-96 14h105m-105 14h87m-87 14h64"/>
  </g>
  <circle className="guide-tap-ring" cx="165" cy="37" r="13" fill="none" stroke="#d5d0c5" strokeWidth="1"/>
  <g transform="translate(160 38)"><TouchHand className="guide-tap-hand"/></g>
 </svg>;
}

export function ReadingGuide({ onDismiss }: { onDismiss: () => void }) {
 const reduced = useReducedMotion();
 const button = useRef<HTMLButtonElement>(null);
 useEffect(() => {
  // Remember the first visit even if the visitor leaves without dismissing it.
  try { localStorage.setItem(GUIDE_KEY, 'true'); } catch {}
  button.current?.focus({ preventScroll: true });
  const overflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => { document.body.style.overflow = overflow; };
 }, []);
 return <motion.div className="reading-guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
  exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .45, ease: [.22, 1, .36, 1] }}>
  <button ref={button} className="reading-guide-dismiss" onClick={onDismiss} onPointerDown={e => {
   if (!e.isPrimary || e.button !== 0) return;
   e.preventDefault();
   e.currentTarget.setPointerCapture(e.pointerId);
   onDismiss();
  }} onKeyDown={e => {
   if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); onDismiss(); }
  }} aria-label="Dismiss introduction" aria-describedby="reading-guide-instructions" data-card-control>
   <span className="reading-guide-content">
    <span className="reading-guide-title">One thought at a time.</span>
    <span id="reading-guide-instructions" className="reading-guide-instructions">
     <span className="reading-guide-demo"><SwipeDrawing/><span>Swipe left for next.<br/><span className="reading-guide-secondary">Swipe right to return.</span></span></span>
     <span className="reading-guide-demo"><TapDrawing/><span>Tap to read more.<br/><span className="reading-guide-secondary">Tap again to fold it away.</span></span></span>
    </span>
    <span className="reading-guide-continue">Touch anywhere to begin<span className="reading-guide-desktop"> · or press Enter</span></span>
   </span>
  </button>
 </motion.div>;
}
