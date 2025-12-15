import { BirdConfig } from '../types/effects';

export class BirdEffect {
    private container: HTMLElement;
    private config: BirdConfig;
    private intervalId: number | null = null;

    constructor(config: BirdConfig) {
        this.container = this.resolveContainer(config.container);
        this.config = this.applyDefaults(config);
    }

    start(): void {
        this.stop(); // Clear any existing
        
        const interval = this.config.interval || 12000;
        
        // Generate first bird immediately
        this.generateBird();
        
        // Then continue at intervals
        this.intervalId = window.setInterval(() => {
            this.generateBird();
        }, interval);
        
        console.log(`🦅 Bird effect started in ${this.getContainerId()}`);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        // Remove existing birds
        const birds = this.container.querySelectorAll(`.${this.config.className || 'bird-flying'}`);
        birds.forEach(bird => bird.remove());
        
        console.log(`🦅 Bird effect stopped in ${this.getContainerId()}`);
    }

    private generateBird(): void {
        const bird = document.createElement('img');
        bird.className = this.config.className || 'bird-flying';

        // Set first frame
        bird.src = this.config.frames[0];
        bird.alt = '';

        // Position at left side, random height
        bird.style.position = 'absolute';
        bird.style.left = '-15%';
        bird.style.top = `${Math.random() * 40}%`;

        // Random size
        const size = this.randomInRange(
            this.config.size?.min || 3,
            this.config.size?.max || 7
        );
        bird.style.width = `${size}%`;

        // Flight duration
        const duration = this.randomInRange(
            this.config.flightDuration?.min || 15,
            this.config.flightDuration?.max || 25
        );

        // Set z-index if provided
        if (this.config.zIndex !== undefined) {
            bird.style.zIndex = String(this.config.zIndex);
        }

        // Animate sprite frames
        this.animateSprite(bird, duration);

        // Animate flight path
        this.animateFlight(bird, duration);

        this.container.appendChild(bird);

        // Remove after flight completes
        setTimeout(() => {
            if (bird.parentNode) {
                bird.remove();
            }
        }, duration * 1000);
    }

    private animateSprite(bird: HTMLImageElement, duration: number): void {
        const frames = this.config.frames;
        const frameCount = frames.length;
        const frameInterval = (duration * 190) / (frameCount * 3); // Cycle frames 3 times
        
        let currentFrame = 0;
        
        const spriteInterval = setInterval(() => {
            currentFrame = (currentFrame + 1) % frameCount;
            bird.src = frames[currentFrame];
        }, frameInterval);

        // Clear interval when bird is removed
        setTimeout(() => {
            clearInterval(spriteInterval);
        }, duration * 1000);
    }

    private animateFlight(bird: HTMLImageElement, duration: number): void {
        bird.style.transition = `transform ${duration}s linear`;
        
        // Slight delay for smooth start
        setTimeout(() => {
            bird.style.transform = `translateX(115vw) translateY(${Math.random() * 40 - 20}px)`;
        }, 50);
    }

    private applyDefaults(config: BirdConfig): BirdConfig {
        return {
            interval: 12000,
            flightDuration: { min: 15, max: 25 },
            size: { min: 3, max: 7 },
            className: 'bird-flying',
            ...config
        };
    }

    private resolveContainer(container: string | HTMLElement): HTMLElement {
        if (typeof container === 'string') {
            const element = document.querySelector(container) as HTMLElement;
            if (!element) {
                throw new Error(`Bird container not found: ${container}`);
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
