export interface ActorMotion {
 kind: 'draw' | 'drift' | 'pulse' | 'reveal' | 'travel' | 'turn' | 'stretch';
 duration?: number; delay?: number; x?: number; y?: number; angle?: number; scale?: number;
}
export interface Actor {
 id: string;
 type: 'path' | 'circle' | 'figure' | 'text' | 'group';
 d?: string; x?: number; y?: number; r?: number; text?: string;
 tone?: 'normal' | 'faint' | 'shade'; fill?: boolean; dashed?: boolean; facing?: boolean;
 motion?: ActorMotion; children?: Actor[];
 anchor?: 'start' | 'middle' | 'end'; fontSize?: number;
 pose?: { rotate?: number; scale?: number; opacity?: number };
}
export interface Composition { actors: Actor[]; description: string; }

export interface LessonBeat { caption: string; duration?: number; actors: Actor[]; }
export interface VisualLesson { description: string; beats: LessonBeat[]; }
