export interface BaseEffectConfig {
    container: string | HTMLElement;
    enabled?: boolean;
    zIndex?: number;
}

export interface SnowConfig extends BaseEffectConfig {
    density?: 'low' | 'medium' | 'high';
    speed?: 'slow' | 'medium' | 'fast';
    size?: { min: number; max: number };
    interval?: number;
    className?: string;
}

export interface WaveConfig extends BaseEffectConfig {
    count?: number;
    images: string[];
    positioning?: {
        left: { min: number; max: number };
        bottom: { min: number; max: number };
    };
    size?: { min: number; max: number };
    opacity?: { min: number; max: number };
    animation?: {
        duration: { min: number; max: number };
    };
    className?: string;
}

export interface BirdConfig extends BaseEffectConfig {
    frames: string[];
    interval?: number;
    flightDuration?: { min: number; max: number };
    size?: { min: number; max: number };
    className?: string;
}

export type EffectType = 'snow' | 'waves' | 'birds';

export interface EffectInstance {
    id: string;
    type: EffectType;
    start: () => void;
    stop: () => void;
    pause?: () => void;
    resume?: () => void;
}
