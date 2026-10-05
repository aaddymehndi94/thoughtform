export interface ActorMotion {
 kind: 'draw' | 'drift' | 'pulse' | 'reveal' | 'travel' | 'turn' | 'stretch';
 duration?: number; delay?: number; x?: number; y?: number; angle?: number; scale?: number;
}
export interface Actor {
 id: string;
 type: 'path' | 'circle' | 'figure' | 'text' | 'group';
 d?: string; x?: number; y?: number; r?: number; text?: string;
 tone?: 'normal' | 'faint' | 'shade'; fill?: boolean; dashed?: boolean;
 motion?: ActorMotion; children?: Actor[];
}
export interface Composition { actors: Actor[]; description: string; }
