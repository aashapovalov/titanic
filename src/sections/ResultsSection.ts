import { effectManager } from '../core/EffectManager';
import { audioManager } from '../core/AudioManager';
import { stateManager } from '../core/StateManager';
import { PredictionAPI } from '../components/PredictionAPI';
import { WAVE_IMAGES, AUDIO } from '../config/assets';
import { getElementById, querySelector, scrollToElement } from '../utils/dom';

export class ResultsSection {
    private snowEffectId: string | null = null;
    private wavesEffectId: string | null = null;
    private predictionAPI: PredictionAPI;
    private tryAgainButton: HTMLElement | null = null;

    constructor() {
        this.predictionAPI = new PredictionAPI();
    }

    initialize(): void {
        console.log('🎯 Initializing Results Section');
        this.setupEventListeners();
    }

    async show(): Promise<void> {
        const state = stateManager.getState();
        
        if (!stateManager.isComplete()) {
            console.error('Cannot show results: state incomplete');
            return;
        }

        console.log('📊 Fetching prediction...');

        try {
            // Get prediction
            const probability = await this.predictionAPI.predict(state);
            const percentage = Math.round(probability * 100);
            const isHopeful = probability >= 0.5;

            console.log(`🎯 Showing results: ${percentage}% survival (${isHopeful ? 'HOPE' : 'SAD'})`);

            // Render results
            this.renderResults(isHopeful, percentage);

            // Setup effects
            this.setupEffects();

            // Play audio
            this.playAudio(isHopeful);

            // Show section
            const resultsSection = getElementById('results');
            if (resultsSection) {
                resultsSection.style.display = 'block';
                scrollToElement(resultsSection, 'start');
            }

        } catch (error) {
            console.error('Failed to show results:', error);
            alert('Failed to get prediction. Please try again.');
        }
    }

    private renderResults(isHopeful: boolean, percentage: number): void {
        const state = isHopeful ? 'hope' : 'sad';

        // Update sky background
        const skyBackground = querySelector('.results__background-sky');
        if (skyBackground) {
            skyBackground.className = `results__background-sky results__background-sky--${state}`;
        }

        // Update emphasis text
        const emphasis = querySelector('.results__emphasis');
        if (emphasis) {
            emphasis.textContent = isHopeful ? 'SURVIVE' : 'NOT SURVIVE';
            emphasis.className = `results__emphasis results__emphasis--${state}`;
        }

        // Update percentage
        const percentageEl = querySelector('.results__percentage');
        if (percentageEl) {
            percentageEl.textContent = `Survival chance: ${percentage}%`;
        }

        // Update subtitle
        const subtitle = querySelector('.results__subtitle');
        if (subtitle) {
            subtitle.textContent = isHopeful
                ? 'Passengers with these characteristics had better odds of being rescued.'
                : 'Passengers with these characteristics rarely made it to the lifeboats.';
        }

        // Update character image
        const character = querySelector<HTMLImageElement>('.results__character');
        if (character) {
            character.src = isHopeful
                ? 'images/results/results_passenger_hope.png'
                : 'images/results/results_passenger_sad.png';
            character.classList.add('results__character--visible');
        }
    }

    private setupEffects(): void {
        // Snow effect
        this.snowEffectId = effectManager.start('snow', {
            container: '#results-snow',
            density: 'medium',
            speed: 'slow',
            interval: 200,
            zIndex: 10
        }, 'results-snow');

        // Wave effect
        this.wavesEffectId = effectManager.start('waves', {
            container: '.results__wave',
            count: 35,
            images: WAVE_IMAGES,
            positioning: {
                left: { min: 0, max: 100 },
                bottom: { min: 10, max: 80 }
            }
        }, 'results-waves');
    }

    private playAudio(isHopeful: boolean): void {
        const audioSrc = isHopeful ? AUDIO.resultHope : AUDIO.resultSad;
        audioManager.play(audioSrc, false, 1.0);
    }

    private setupEventListeners(): void {
        this.tryAgainButton = getElementById('try-again-btn');
        
        if (this.tryAgainButton) {
            this.tryAgainButton.addEventListener('click', () => this.handleTryAgain());
        }
    }

    private handleTryAgain(): void {
        console.log('🔄 Try again clicked - returning to search');
        this.hide();
        scrollToElement('#search', 'start');
    }

    hide(): void {
        console.log('👋 Hiding results section');

        // Stop effects
        if (this.snowEffectId) effectManager.stop(this.snowEffectId);
        if (this.wavesEffectId) effectManager.stop(this.wavesEffectId);

        // Stop audio
        audioManager.stopAll();

        // Hide section
        const resultsSection = getElementById('results');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }

    cleanup(): void {
        console.log('🧹 Cleaning up Results Section');
        this.hide();
    }
}
