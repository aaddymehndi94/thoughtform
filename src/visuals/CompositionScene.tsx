import type { CSSProperties } from 'react';
import type { Actor, Composition } from './types';
import { Human } from './NarrativeScene';
import { LessonStill } from './LessonStill';
function ActorView({ actor }: { actor: Actor }) {
 const m=actor.motion;
 const style = m ? { '--actor-time': `${m.duration || 14}s`, '--actor-delay': `${m.delay || 0}s`, '--actor-x': `${m.x || 0}px`, '--actor-y': `${m.y || 0}px`, '--actor-angle': `${m.angle || 0}deg`, '--actor-scale': m.scale || 1.06 } as CSSProperties : undefined;
 const content = actor.type === 'path' ? <path d={actor.d} pathLength={m?.kind==='draw'?1:undefined} className={actor.fill?'actor-filled':''}/> : actor.type==='circle' ? <circle cx="0" cy="0" r={actor.r || 15} className={actor.fill?'actor-filled':''}/> : actor.type==='figure' ? <Human x={0} y={0} shade={actor.tone==='shade'} facing={actor.facing}/> : actor.type==='text' ? <text className="notebook-text" x={0} y={0}>{actor.text}</text> : <>{actor.children?.map(a=><ActorView key={a.id} actor={a}/>)}</>;
 return <g transform={`translate(${actor.x || 0} ${actor.y || 0})`} className={`${actor.tone==='faint'?'faint':''} ${actor.tone==='shade'?'shade':''} ${actor.dashed?'actor-dashed':''}`}><g className={m?`scene-actor actor-${m.kind}`:''} style={style}>{content}</g></g>;
}
export function CompositionScene({ composition, staticScene = false }: { composition: Composition; staticScene?: boolean }) { return <g className={`composition-scene ${staticScene?'static-scene':''}`}>{composition.actors.map(actor=>staticScene?<LessonStill key={actor.id} actor={actor}/>:<ActorView key={actor.id} actor={actor}/>)}</g>; }
export function MarginDrawing({ composition }: { composition: Composition }) {return <figure className="margin-drawing" role="img" aria-label={composition.description}><svg viewBox="0 0 400 250" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><CompositionScene composition={composition} staticScene/></svg></figure>;}
