import { useEffect, useId, useRef } from 'react';
import { Icon } from '../components/Icons';
import { PLAYBACK_SPEEDS, speedLabel, type LessonPlayback } from './playback';

interface Props {
 beat: number; count: number; manual: boolean; reduced: boolean;
 open: boolean; onOpenChange: (open: boolean) => void;
 onStep: (direction: number) => void; playback?: LessonPlayback;
}

export function LessonControls({ beat, count, manual, reduced, open, onOpenChange, onStep, playback }: Props) {
 const id = useId();
 const controls = useRef<HTMLDivElement>(null);
 const trigger = useRef<HTMLButtonElement>(null);
 const panel = useRef<HTMLDivElement>(null);
 const speedIndex = PLAYBACK_SPEEDS.findIndex(speed => speed === playback?.speed);
 function close() { onOpenChange(false); trigger.current?.focus({ preventScroll: true }); }
 useEffect(() => {
  if (!open) return;
  panel.current?.querySelector<HTMLElement>('[role="switch"]:not(:disabled), .lesson-settings-close')?.focus({ preventScroll: true });
  function dismiss(event: PointerEvent) {
   if (controls.current?.contains(event.target as Node)) return;
   // Dismissing the panel is its own action, separate from the card's tap gesture.
   event.stopPropagation();
   onOpenChange(false);
  }
  document.addEventListener('pointerdown', dismiss, true);
  return () => document.removeEventListener('pointerdown', dismiss, true);
 }, [open, onOpenChange]);
 return <div className="lesson-controls" ref={controls} data-card-control=""
  onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) onOpenChange(false); }}
  onKeyDown={event => { if (event.key === 'Escape' && open) { event.preventDefault(); event.stopPropagation(); close(); } }}>
  <div className="lesson-stage-navigation">
   {manual && <button className="lesson-step" aria-label="Previous animation stage" onClick={() => onStep(-1)} disabled={beat === 0}><Icon name="arrow-left" size={14}/></button>}
   <div className="lesson-timing" aria-hidden="true">{Array.from({ length: count }, (_, i) => <span key={i} className={i === beat ? 'current' : i < beat ? 'passed' : ''}/>)}</div>
   {manual && <button className="lesson-step" aria-label="Next animation stage" onClick={() => onStep(1)} disabled={beat === count - 1}><Icon name="arrow-right" size={14}/></button>}
  </div>
  {playback && <>
   <button className={`lesson-settings-trigger ${open ? 'is-open' : ''}`} ref={trigger} aria-label="Animation settings" aria-expanded={open} aria-controls={id} onClick={() => onOpenChange(!open)}><Icon name="settings" size={16}/></button>
   {open && <div className="lesson-settings-panel" id={id} ref={panel} role="dialog" aria-label="Animation settings">
    <div className="lesson-settings-heading"><span>Animation</span><button className="lesson-settings-close" aria-label="Close animation settings" onClick={close}><Icon name="close" size={14}/></button></div>
    <div className="lesson-setting-row"><span>Autoplay</span><button className="lesson-autoplay" role="switch" aria-label="Autoplay animation" aria-checked={!manual} disabled={reduced} onClick={() => playback.onAutoplayChange(manual)}><span/></button></div>
    <div className="lesson-setting-row"><span>Speed</span><div className="lesson-speed-controls">
     <button aria-label="Slower animation" disabled={reduced || speedIndex === 0} onClick={() => playback.onSpeedChange(PLAYBACK_SPEEDS[Math.max(0, speedIndex - 1)])}><Icon name="arrow-left" size={14}/></button>
     <button className="lesson-speed-value" aria-label={`Animation speed ${speedLabel(playback.speed)}; press to cycle speeds`} disabled={reduced} onClick={() => playback.onSpeedChange(PLAYBACK_SPEEDS[(speedIndex + 1) % PLAYBACK_SPEEDS.length])}>{speedLabel(playback.speed)}</button>
     <button aria-label="Faster animation" disabled={reduced || speedIndex === PLAYBACK_SPEEDS.length - 1} onClick={() => playback.onSpeedChange(PLAYBACK_SPEEDS[Math.min(PLAYBACK_SPEEDS.length - 1, speedIndex + 1)])}><Icon name="arrow-right" size={14}/></button>
    </div></div>
    {(manual || reduced) && <p className="lesson-settings-hint">{reduced ? 'Reduced motion is on. Step through with the arrows.' : 'Tap either side of the drawing, swipe, or use the arrows.'}</p>}
   </div>}
  </>}
 </div>;
}
