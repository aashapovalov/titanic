import { effectManager } from './core/EffectManager';
import { audioManager } from './core/AudioManager';
import { HeroSection } from './sections/HeroSection';
import { SearchSection } from './sections/SearchSection';
import { ResultsSection } from './sections/ResultsSection';
import { getElementById } from './utils/dom';

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
// Section instances
let heroSection: HeroSection;
let searchSection: SearchSection;
let resultsSection: ResultsSection;


function initializeApp(): void {
    console.log('🚀 Titanic Survival Simulator - Starting...');
    scrollToHero();

    // Initialize sections
    heroSection = new HeroSection();
    searchSection = new SearchSection();
    resultsSection = new ResultsSection();


    // Initialize all sections
    heroSection.initialize();
    searchSection.initialize();
    resultsSection.initialize();

    // Setup start screen
    setupStartScreen();

    // Setup global event listeners
    setupGlobalEventListeners();

    console.log('✅ Application initialized successfully');
}

function setupStartScreen(): void {
    const startButton = getElementById('start-button');
    const startScreen = getElementById('start-screen');

    if (startButton && startScreen) {
        startButton.addEventListener('click', () => {
            console.log('🎬 Starting experience...');
            
            // Hide start screen
            document.body.classList.add('experience-started');
            startScreen.classList.add('start-screen--hidden');
            heroSection.setupAudio();

            // Show hero section (already initialized)
            console.log('✅ Experience started');
        });
    }
}

function setupGlobalEventListeners(): void {
    // Listen for navigation to results
    document.addEventListener('navigate-to-results', async () => {
        await resultsSection.show();
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
}

function cleanup(): void {
    console.log('🧹 Cleaning up application...');

    // Stop all effects
    effectManager.stopAll();

    // Stop all audio
    audioManager.stopAll();

    // Cleanup sections
    heroSection?.cleanup();
    searchSection?.cleanup();
    resultsSection?.cleanup();

    console.log('✅ Cleanup complete');
}

function scrollToHero(): void {
    const hero = document.getElementById('hero');
    if (!hero) return;

    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
        hero.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

export { cleanup };
