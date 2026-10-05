import type { Composition } from '../visuals/types';
export type SceneKind = 'notebook' | 'shadow' | 'persona' | 'projection' | 'complex' | 'individuation' | 'self' | 'dream' | 'opposites' | 'symbol' | 'unconscious' | 'ego' | 'dialogue';
export interface Source { title: string; author: string; reference: string; url: string; }
export interface Thought {
 id: string; thinker: string; collection: string; concept: string; title: string; statement: string;
 explanation: string; reflection?: string; readingArt?: Composition[]; nuance: string; sources: string[]; metaphor: string;
 scene: { kind: SceneKind; caption: string; variant?: string; composition?: Composition }; tags: string[]; depth: 1 | 2 | 3;
 sequence?: { id: string; order: number }; related: string[];
}
export const thinkers = [{ id: 'jung', name: 'Carl Jung', years: '1875–1961', description: 'The life beneath the life we know.' }];
