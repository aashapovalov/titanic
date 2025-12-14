import { WaveConfig } from '../types/effects';

export class WaveEffect {
    private container: HTMLElement;
    private config: WaveConfig;

    constructor(config: WaveConfig) {
        this.container = this.resolveContainer(config.container);
        this.config = this.applyDefaults(config);
    }

    start(): void {
        this.stop(); // Clear any existing
        this.generateWaves();
        console.log(`🌊 Wave effect started in ${this.getContainerId()}`);
    }

    stop(): void {
        this.container.innerHTML = '';
        console.log(`🌊 Wave effect stopped in ${this.getContainerId()}`);
    }

    private generateWaves(): void {
        const count = this.config.count || 40;
        
        for (let i = 0; i < count; i++) {
            this.createWave();
        }
    }

    private createWave(): void {
        const wave = document.createElement('img');
        
        // Random wave image
        const randomImage = this.config.images[
            Math.floor(Math.random() * this.config.images.length)
        ];
        wave.src = randomImage;
        wave.alt = '';
        wave.className = this.config.className || 'wave-generated';

        // Random positioning
        const positioning = this.config.positioning || {
            left: { min: 0, max: 100 },
            bottom: { min: 10, max: 80 }
        };

        wave.style.position = 'absolute';
        wave.style.left = `${this.randomInRange(
            positioning.left.min,
            positioning.left.max
        )}%`;
        wave.style.bottom = `${this.randomInRange(
            positioning.bottom.min,
            positioning.bottom.max
        )}%`;

        // Random size
        const size = this.randomInRange(
            this.config.size?.min || 4,
            this.config.size?.max || 10
        );
        wave.style.width = `${size}%`;

        // Random opacity
        const opacity = this.randomInRange(
            this.config.opacity?.min || 0.3,
            this.config.opacity?.max || 0.9
        );
        wave.style.opacity = String(opacity);

        // Random animation duration
        const duration = this.randomInRange(
            this.config.animation?.duration.min || 4,
            this.config.animation?.duration.max || 9
        );
        wave.style.animationDuration = `${duration}s`;

        // Random delay (negative for staggered effect)
        const delay = -Math.random() * duration;
        wave.style.animationDelay = `${delay}s`;

        // Set z-index if provided
        if (this.config.zIndex !== undefined) {
            wave.style.zIndex = String(this.config.zIndex);
        } else {
            wave.style.zIndex = '2';
        }

        this.container.appendChild(wave);
    }

    private applyDefaults(config: WaveConfig): WaveConfig {
        return {
            count: 40,
            positioning: {
                left: { min: 0, max: 100 },
                bottom: { min: 10, max: 80 }
            },
            size: { min: 4, max: 10 },
            opacity: { min: 0.3, max: 0.9 },
            animation: {
                duration: { min: 4, max: 9 }
            },
            className: 'wave-generated',
            ...config
        };
    }

    private resolveContainer(container: string | HTMLElement): HTMLElement {
        if (typeof container === 'string') {
            const element = document.querySelector(container) as HTMLElement;
            if (!element) {
                throw new Error(`Wave container not found: ${container}`);
            }
            return element;
        }
        return container;
    }

    private getContainerId(): string {
        return this.container.id || this.container.className || 'unknown';
    }

    private randomInRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }
}
