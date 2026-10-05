import type { Actor } from './types';
import { Human } from './NarrativeScene';
/** The same drawing in a readable final pose, without an animation runtime. */
export function LessonStill({ actor }: { actor: Actor }) {
 const pose=actor.pose||{};
 const opacity=(actor.tone==='faint'?.3:actor.tone==='shade'?.6:1)*(pose.opacity??1);
 const filled=actor.fill?{fill:'#888174',fillOpacity:.12}:{};
 return <g transform={`translate(${actor.x||0} ${actor.y||0}) rotate(${pose.rotate||0}) scale(${pose.scale||1})`} opacity={opacity} strokeDasharray={actor.dashed?'3 5':undefined}>
  {actor.type==='path'?<path d={actor.d} {...filled}/>:actor.type==='circle'?<circle r={actor.r||15} {...filled}/>:actor.type==='figure'?<Human x={0} y={0} shade={actor.tone==='shade'} facing={actor.facing}/>:actor.type==='text'?<text x={0} y={0} textAnchor={actor.anchor||'start'} className="lesson-label" style={{fontSize:actor.fontSize||18}}>{actor.text}</text>:actor.children?.map(child=><LessonStill key={child.id} actor={child}/>)}
 </g>;
}
