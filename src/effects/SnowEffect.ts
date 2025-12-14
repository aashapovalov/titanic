import { SnowConfig } from '../types/effects';

export class SnowEffect {
    private container: HTMLElement;
    private config: SnowConfig;
    private intervalId: number | null = null;
    private readonly DENSITY_MAP = {
        low: 400,
        medium: 200,
        high: 150
    };

    constructor(config: SnowConfig) {
        this.container = this.resolveContainer(config.container);
        this.config = this.applyDefaults(config);
    }

    start(): void {
        this.stop(); // Clear any existing
        
        const interval = this.config.interval || this.DENSITY_MAP[this.config.density || 'medium'];
        
        this.intervalId = window.setInterval(() => {
            this.generateFlake();
        }, interval);
        
        console.log(`🌨️ Snow effect started in ${this.getContainerId()}`);
    }

    stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.container.innerHTML = '';
        console.log(`❄️ Snow effect stopped in ${this.getContainerId()}`);
    }

    private generateFlake(): void {
        const flake = document.createElement('div');
        flake.className = this.config.className || 'snowflake';

        // Random size
        const size = this.randomInRange(
            this.config.size?.min || 2,
            this.config.size?.max || 6
        );
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;

        // Random horizontal position
        flake.style.left = `${Math.random() * 100}%`;

        // Animation duration based on speed
        const duration = this.getDurationForSpeed();
        flake.style.animationDuration = `${duration}s`;

        // Random horizontal drift
        const drift = (Math.random() - 0.5) * 100;
        flake.style.setProperty('--drift', `${drift}px`);

        // Random start position
        flake.style.setProperty('--start-y', `-${Math.random() * 10}vh`);

        // Set z-index if provided
        if (this.config.zIndex) {
            flake.style.zIndex = String(this.config.zIndex);
        }

        this.container.appendChild(flake);

        // Auto-remove after animation
        setTimeout(() => {
            if (flake.parentNode) {
                flake.remove();
            }
        }, duration * 1000);
    }


    private getDurationForSpeed(): number {
        const speedMap = {
            slow: { min: 10, max: 15 },
            medium: { min: 8, max: 12 },
            fast: { min: 6, max: 10 }
        };
        
        const range = speedMap[this.config.speed || 'medium'];
        return this.randomInRange(range.min, range.max);
    }


    private applyDefaults(config: SnowConfig): SnowConfig {
        return {
            density: 'medium',
            speed: 'medium',
            size: { min: 2, max: 6 },
            className: 'snowflake',
            ...config
        };
    }

    private resolveContainer(container: string | HTMLElement): HTMLElement {
        if (typeof container === 'string') {
            const element = document.querySelector(container) as HTMLElement;
            if (!element) {
                throw new Error(`Snow container not found: ${container}`);
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
