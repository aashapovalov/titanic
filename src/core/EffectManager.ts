import { SnowEffect } from '../effects/SnowEffect';
import { WaveEffect } from '../effects/WaveEffect';
import { BirdEffect } from '../effects/BirdEffect';
import { EffectType, EffectInstance, SnowConfig, WaveConfig, BirdConfig } from '../types/effects';

export class EffectManager {
    private static instance: EffectManager;
    private effects: Map<string, EffectInstance> = new Map();

    private constructor() {
        console.log('🎬 EffectManager initialized');
    }

    static getInstance(): EffectManager {
        if (!EffectManager.instance) {
            EffectManager.instance = new EffectManager();
        }
        return EffectManager.instance;
    }

    start(
        type: EffectType,
        config: SnowConfig | WaveConfig | BirdConfig,
        id?: string
    ): string {
        const effectId = id || this.generateId(type);

        // Stop existing effect with same ID
        if (this.effects.has(effectId)) {
            this.stop(effectId);
        }

        // Create appropriate effect instance
        let effect: EffectInstance;
        
        switch (type) {
            case 'snow':
                const snowEffect = new SnowEffect(config as SnowConfig);
                effect = {
                    id: effectId,
                    type: 'snow',
                    start: () => snowEffect.start(),
                    stop: () => snowEffect.stop()
                };
                break;
                
            case 'waves':
                const waveEffect = new WaveEffect(config as WaveConfig);
                effect = {
                    id: effectId,
                    type: 'waves',
                    start: () => waveEffect.start(),
                    stop: () => waveEffect.stop()
                };
                break;
                
            case 'birds':
                const birdEffect = new BirdEffect(config as BirdConfig);
                effect = {
                    id: effectId,
                    type: 'birds',
                    start: () => birdEffect.start(),
                    stop: () => birdEffect.stop()
                };
                break;
                
            default:
                throw new Error(`Unknown effect type: ${type}`);
        }

        // Store and start
        this.effects.set(effectId, effect);
        effect.start();

        console.log(`✨ Effect started: ${effectId} (${type})`);
        return effectId;
    }

    stop(effectId: string): void {
        const effect = this.effects.get(effectId);
        if (effect) {
            effect.stop();
            this.effects.delete(effectId);
            console.log(`🛑 Effect stopped: ${effectId}`);
        }
    }

    stopType(type: EffectType): void {
        const effectsToStop: string[] = [];
        
        this.effects.forEach((effect, id) => {
            if (effect.type === type) {
                effectsToStop.push(id);
            }
        });
        
        effectsToStop.forEach(id => this.stop(id));
        console.log(`🛑 All ${type} effects stopped`);
    }

    stopAll(): void {
        console.log(`🛑 Stopping all effects (${this.effects.size} active)`);
        
        this.effects.forEach(effect => effect.stop());
        this.effects.clear();
    }

    isRunning(effectId: string): boolean {
        return this.effects.has(effectId);
    }

    getActiveCount(): number {
        return this.effects.size;
    }

    getActiveEffects(): string[] {
        return Array.from(this.effects.keys());
    }

    private generateId(type: string): string {
        return `${type}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    }
}

export const effectManager = EffectManager.getInstance();
