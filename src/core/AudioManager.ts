export class AudioManager {
    private static instance: AudioManager;
    private audioElements: Map<string, HTMLAudioElement> = new Map();

    private constructor() {
        console.log('🔊 AudioManager initialized');
    }

    static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    async play(src: string, loop: boolean = false, volume: number = 1.0): Promise<void> {
        // Stop existing audio with same source
        if (this.audioElements.has(src)) {
            this.stop(src);
        }

        // Create new audio element
        const audio = new Audio(src);
        audio.loop = loop;
        audio.volume = Math.max(0, Math.min(1, volume)); // Clamp 0-1

        // Store reference
        this.audioElements.set(src, audio);

        try {
            await audio.play();
            console.log(`▶️ Playing: ${this.getFileName(src)} (loop: ${loop}, volume: ${volume})`);
        } catch (error) {
            console.error(`Failed to play audio: ${src}`, error);
            this.audioElements.delete(src);
            throw error;
        }
    }

    stop(src: string): void {
        const audio = this.audioElements.get(src);
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
            this.audioElements.delete(src);
            console.log(`⏹️ Stopped: ${this.getFileName(src)}`);
        }
    }

    stopAll(): void {
        console.log(`⏹️ Stopping all audio (${this.audioElements.size} tracks)`);
        
        this.audioElements.forEach((audio, src) => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        this.audioElements.clear();
    }

    async crossfade(
        fromSrc: string,
        toSrc: string,
        duration: number = 2000,
        toLoop: boolean = false,
        toVolume: number = 1.0
    ): Promise<void> {
        console.log(`🔄 Crossfading: ${this.getFileName(fromSrc)} → ${this.getFileName(toSrc)}`);

        const fromAudio = this.audioElements.get(fromSrc);
        
        // Start new audio at volume 0
        await this.play(toSrc, toLoop, 0);
        const toAudio = this.audioElements.get(toSrc);
        
        if (!toAudio) {
            console.error('Failed to start new audio for crossfade');
            return;
        }

        const startTime = Date.now();
        const fromVolume = fromAudio?.volume || 0;

        const fade = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Fade out old audio
            if (fromAudio) {
                fromAudio.volume = fromVolume * (1 - progress);
            }

            // Fade in new audio
            toAudio.volume = toVolume * progress;

            if (progress < 1) {
                requestAnimationFrame(fade);
            } else {
                // Crossfade complete
                if (fromAudio) {
                    this.stop(fromSrc);
                }
                console.log(`✅ Crossfade complete`);
            }
        };

        requestAnimationFrame(fade);
    }

    setVolume(src: string, volume: number): void {
        const audio = this.audioElements.get(src);
        if (audio) {
            audio.volume = Math.max(0, Math.min(1, volume));
            console.log(`🔊 Volume set: ${this.getFileName(src)} = ${volume}`);
        }
    }

    isPlaying(src: string): boolean {
        const audio = this.audioElements.get(src);
        return audio ? !audio.paused : false;
    }

    getVolume(src: string): number {
        const audio = this.audioElements.get(src);
        return audio?.volume || 0;
    }

    getActiveCount(): number {
        return this.audioElements.size;
    }

    private getFileName(path: string): string {
        return path.split('/').pop() || path;
    }
}

export const audioManager = AudioManager.getInstance();
