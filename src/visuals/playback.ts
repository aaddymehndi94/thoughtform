export const PLAYBACK_SPEEDS = [.5, .75, 1, 1.25, 1.5, 1.75, 2] as const;

export interface LessonPlayback {
 speed: number;
 onSpeedChange: (speed: number) => void;
 onAutoplayChange: (enabled: boolean) => void;
}

export function speedLabel(speed: number) {
 return `${Number.isInteger(speed) ? speed.toFixed(1) : speed}×`;
}
