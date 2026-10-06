import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Icon } from './Icons';

const GUIDE_KEY = 'thoughtform.reading-guide.seen';

export function needsReadingGuide() {
 try { return localStorage.getItem(GUIDE_KEY) !== 'true'; }
 catch { return true; }
}

export function ReadingGuide({ onDismiss }: { onDismiss: () => void }) {
 const reduced = useReducedMotion();
 useEffect(() => {
  // Remember the first visit even if the visitor leaves without dismissing it.
  try { localStorage.setItem(GUIDE_KEY, 'true'); } catch {}
 }, []);
 return <motion.aside className="reading-guide" aria-label="How to read thoughtform" data-card-control
  initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: reduced ? 0 : 4 }} transition={{ duration: reduced ? 0 : .22 }}>
  <div className="reading-guide-copy">
   <p><Icon name="arrow-left" size={16}/><span>Swipe left for the next thought.</span></p>
   <p><Icon name="arrow-right" size={16}/><span>Swipe right to return.</span></p>
   <p className="reading-guide-tap">Tap the card to read more.</p>
  </div>
  <button onClick={onDismiss} className="reading-guide-dismiss" aria-label="Dismiss reading guide">Got it<Icon name="close" size={14}/></button>
 </motion.aside>;
}
