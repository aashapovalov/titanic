import { effectManager } from '../core/EffectManager';
import { audioManager } from '../core/AudioManager';
import { BIRD_FRAMES, WAVE_IMAGES, AUDIO } from '../config/assets';
import { getElementById, scrollToElement } from '../utils/dom';

export class HeroSection {
    private snowEffectId: string | null = null;
    private wavesEffectId: string | null = null;
    private birdsEffectId: string | null = null;
    private ctaButton: HTMLElement | null = null;

    initialize(): void {
        console.log('🎬 Initializing Hero Section');

        // Setup effects
        this.setupSnow();
        this.setupWaves();
        this.setupBirds();
        this.setupAudio();
        this.setupEventListeners();
    }

    private setupSnow(): void {
        this.snowEffectId = effectManager.start('snow', {
            container: '#snow-layer',
            density: 'high',
            speed: 'medium',
            interval: 150,
            zIndex: 10
        }, 'hero-snow');
    }

    private setupWaves(): void {
        this.wavesEffectId = effectManager.start('waves', {
            container: '.hero__scene',
            count: 40,
            images: WAVE_IMAGES,
            positioning: {
                left: { min: 0, max: 100 },
                bottom: { min: 10, max: 60 }
            },
            zIndex: 2
        }, 'hero-waves');
    }

    private setupBirds(): void {
        this.birdsEffectId = effectManager.start('birds', {
            container: '.hero__scene',
            frames: BIRD_FRAMES,
            interval: 12000,
            zIndex: 5
        }, 'hero-birds');
    }

    private setupAudio(): void {
        audioManager.play(AUDIO.hero, false, 0.5);
    }

    private setupEventListeners(): void {
        this.ctaButton = getElementById('hero-cta');
        
        if (this.ctaButton) {
            this.ctaButton.addEventListener('click', () => this.handleCTAClick());
        }
    }

    private handleCTAClick(): void {
        console.log('🔘 Hero CTA clicked - transitioning to search');

        // Crossfade audio
        audioManager.crossfade(AUDIO.hero, AUDIO.search, 2000, true, 0.3);

        // Scroll to search
        scrollToElement('#search', 'start');
    }

    cleanup(): void {
        console.log('🧹 Cleaning up Hero Section');

        if (this.snowEffectId) effectManager.stop(this.snowEffectId);
        if (this.wavesEffectId) effectManager.stop(this.wavesEffectId);
        if (this.birdsEffectId) effectManager.stop(this.birdsEffectId);
        
        audioManager.stop(AUDIO.hero);
    }
}
