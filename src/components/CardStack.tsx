import { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import type { Thought } from '../content/types';
import { Illustration } from '../visuals/Illustration';
import { Icon } from './Icons';
export function CardStack({ card, next, index, total, saved, onSave, onMove, onDetails }: { card: Thought; next: Thought; index: number; total: number; saved: boolean; onSave: () => void; onMove: (direction: number) => void; onDetails: () => void }) {
 const x = useMotionValue(0); const rotate = useTransform(x, [-350,0,350], [-7,0,7]); const underScale = useTransform(x, [-240,0,240], [1,.975,1]);
 const reduced = useReducedMotion(); const [leaving, setLeaving] = useState(false); const start = useRef({ x: 0, y: 0, time: 0, axis: '' });
 function release(e: React.PointerEvent<HTMLElement>) {
  const delta = x.get(); const velocity = delta / Math.max(1, performance.now() - start.current.time);
  if(start.current.axis === 'x' && (Math.abs(delta) > 78 || (Math.abs(delta)>28 && Math.abs(velocity)>.5))) {
   const direction = delta < 0 ? 1 : -1; if((direction < 0 && index===0) || (direction > 0 && index===total-1)) {x.set(0);return;}
   setLeaving(true); window.setTimeout(()=>onMove(direction),reduced?0:180);
  } else x.set(0);
  if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);
  start.current.axis='';
 }
 return <div className="stack"><motion.div className="under-card" style={{scale:underScale}} aria-hidden="true"><span>{next.title}</span></motion.div><motion.article className="teaching-card" style={{x,rotate:reduced?0:rotate}} initial={{opacity:0,y:reduced?0:12,scale:reduced?1:.985}} animate={{opacity:leaving?0:1,y:0,scale:1,...(leaving?{x:x.get()<0?-500:500}:{})}} transition={{type:'spring',stiffness:300,damping:32}} onPointerDown={e=>{if((e.target as HTMLElement).closest('button'))return;start.current={x:e.clientX,y:e.clientY,time:performance.now(),axis:''};}} onPointerMove={e=>{if(!e.buttons && e.pointerType==='mouse')return; const dx=e.clientX-start.current.x,dy=e.clientY-start.current.y;if(!start.current.axis && Math.max(Math.abs(dx),Math.abs(dy))>9)start.current.axis=Math.abs(dx)>Math.abs(dy)*1.3?'x':'y';if(start.current.axis==='x'){if(!e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.setPointerCapture(e.pointerId); const edge=(dx>0&&index===0)||(dx<0&&index===total-1);x.set(dx*(edge?.18:.85));}}} onPointerUp={release} onPointerCancel={()=>{x.set(0);start.current.axis='';}} aria-label={`${card.title}, thought ${index+1} of ${total}`}>
 <div className="card-heading"><span className="eyebrow">Carl Jung <span className="middot">/</span> {card.concept}</span><button className={`icon-button bookmark ${saved?'saved':''}`} aria-label={saved?'Remove bookmark':'Bookmark this thought'} aria-pressed={saved} onClick={onSave}><Icon name="bookmark" size={18}/></button></div>
 <Illustration kind={card.scene.kind} caption={card.scene.caption}/>
 <div className="card-copy"><span className="concept-number">{String(index+1).padStart(3,'0')} <span>—</span> {card.collection}</span><h1>{card.title}</h1><p className="statement">{card.statement}</p><p className="explanation">{card.explanation}</p><button className="depth-link" onClick={onDetails}>Look a little closer <span>↗</span></button></div>
 <div className="card-bottom"><span>AN INNER INDEX</span><span className="small-cross">+</span><span>ONE THOUGHT AT A TIME</span></div>
 </motion.article></div>;
}
