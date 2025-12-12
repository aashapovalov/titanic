// Bird sprite frames
const birdFrames: string[] = [
    "src/public/images/hero/bird_ph1.png",
    "src/public/images/hero/bird_ph2.png",
    "src/public/images/hero/bird_ph3.png",
    "src/public/images/hero/bird_ph4.png",
    "src/public/images/hero/bird_ph5.png",
    "src/public/images/hero/bird_ph6.png",
    "src/public/images/hero/bird_ph7.png",
    "src/public/images/hero/bird_ph8.png",
    "src/public/images/hero/bird_ph9.png",
];

const snowLayer = document.getElementById("snow-layer") as HTMLElement | null;
const heroCta = document.getElementById("hero-cta") as HTMLButtonElement | null;
const heroAudio = document.getElementById("hero-audio") as HTMLAudioElement | null;
const heroScene = document.querySelector(".hero__scene") as HTMLElement | null;

const startScreen = document.getElementById("start-screen") as HTMLElement | null;
const startButton = document.getElementById("start-button") as HTMLButtonElement | null;

let snowIntervalId: number | null = null;
let birdGenerationIntervalId: number | null = null;
let experienceStarted: boolean = false;

/**
 * Start the entire experience - called when user clicks start button
 */
function startExperience(): void {
    if (experienceStarted) return;
    experienceStarted = true;

    // Add class to body to start all animations
    document.body.classList.add('experience-started');

    // Hide start screen
    if (startScreen) {
        startScreen.classList.add('start-screen--hidden');
    }

    // Play audio once
    if (heroAudio) {
        heroAudio.volume = 0.5;
        heroAudio.loop = false;
        heroAudio.currentTime = 0;
        heroAudio.play().catch((error: Error) => {
            console.log("Audio play error:", error);
        });
    }

    // Start all animations immediately
    startSnowfall();

    // Start seagulls after 5 seconds
    setTimeout(() => {
        startSeagullGeneration();
    }, 5000);

    // Note: Waves are already generated, ship and trail animations
    // will now start playing due to .experience-started class
}

/**
 * Create a single seagull with random properties
 */
function createSeagull(): void {
    if (!heroScene) return;

    const bird: HTMLImageElement = document.createElement("img");
    bird.src = birdFrames[0]; // Start with first frame
    bird.alt = "Seagull";
    bird.className = "hero__bird hero__bird--dynamic";

    // Random size variation (6-10% width)
    const size: number = 6 + Math.random() * 4;

    // Random top position (8-20% from top)
    const topPosition: number = 8 + Math.random() * 12;

    // Random flight duration (10-16 seconds)
    const duration: number = 10 + Math.random() * 6;

    bird.style.width = `${size}%`;
    bird.style.top = `${topPosition}%`;
    bird.style.animationDuration = `${duration}s`;

    heroScene.appendChild(bird);

    // Animate sprite frames
    let frameIndex: number = 0;
    const spriteInterval = setInterval(() => {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);

    // Remove bird after animation completes
    setTimeout(() => {
        clearInterval(spriteInterval);
        if (bird.parentNode === heroScene) {
            heroScene.removeChild(bird);
        }
    }, duration * 1000 + 500);
}

/**
 * Start generating seagulls at intervals
 */
function startSeagullGeneration(): void {
    // Generate first bird immediately
    createSeagull();

    // Then generate new birds every 8-15 seconds
    birdGenerationIntervalId = window.setInterval(() => {
        createSeagull();
    }, 8000 + Math.random() * 7000); // 8-15 seconds
}

// Wave image paths
const waveImages: string[] = [
    "src/public/images/hero/hero_wave_dark_l.png",
    "src/public/images/hero/hero_wave_light_l.png",
    "src/public/images/hero/hero_wave_dark_s.png",
    "src/public/images/hero/hero_wave_light_s.png"
];

/**
 * Generate random waves dynamically
 * Waves are distributed across the sea surface and start animating immediately
 */
function generateRandomWaves(): void {
    if (!heroScene) return;

    const numberOfWaves: number = 30 + Math.floor(Math.random() * 11); // 30-40 waves

    // Sea layer is 55% of viewport height, starting from bottom
    const seaHeightPercent: number = 55; // Sea layer height in vh
    const seaStartPercent: number = 0; // Sea starts at bottom of viewport

    for (let i: number = 0; i < numberOfWaves; i++) {
        const wave: HTMLImageElement = document.createElement("img");

        // Random wave image
        const randomImage: string = waveImages[Math.floor(Math.random() * waveImages.length)];
        wave.src = randomImage;
        wave.alt = "";
        wave.className = "hero__wave hero__wave--generated";

        // Random positioning - distributed across entire width
        const left: number = Math.random() * 100; // 0-100% - full horizontal spread

        // Position waves within sea layer only (10-80% of sea height)
        // Sea layer = bottom 0% to 55% of viewport
        // We want waves from 10% to 80% of that range
        const wavePositionInSea: number = 0.1 + Math.random() * 0.7; // 10% to 90% within sea
        const bottom: number = seaStartPercent + (seaHeightPercent * wavePositionInSea); // 5.5% to 44% of viewport

        // Random size (smaller waves are further back)
        const size: number = 4 + Math.random() * 6; // 4-10%

        // Random opacity (less opaque = further back)
        const opacity: number = 0.3 + Math.random() * 0.6; // 0.3-0.9

        // Random animation duration (slower = further back, faster = closer)
        const duration: number = 4 + Math.random() * 5; // 4-9 seconds

        // Random start point in animation cycle - makes waves start moving immediately
        const delay: number = -Math.random() * duration; // Negative delay = already in progress

        // Apply styles
        wave.style.position = "absolute";
        wave.style.left = `${left}%`;
        wave.style.bottom = `${bottom}%`;
        wave.style.width = `${size}%`;
        wave.style.opacity = `${opacity}`;
        wave.style.zIndex = "2"; // In front of sea (1), behind foreground elements
        wave.style.animationDuration = `${duration}s`;
        wave.style.animationDelay = `${delay}s`; // Negative delay starts animation mid-cycle

        // Add to scene
        heroScene.appendChild(wave);
    }
}

/**
 * Create continuous snowfall effect
 * Generates snowflakes with random properties
 */
function startSnowfall(): void {
    if (!snowLayer) return;

    const createSnowflake = (): void => {
        const flake: HTMLDivElement = document.createElement("div");
        flake.className = "snowflake";

        // Random horizontal start position
        const startLeft: number = Math.random() * 100;

        // Random fall duration (8-14 seconds)
        const duration: number = 8000 + Math.random() * 6000;

        // Random starting Y position (start from different heights for scattered effect)
        const startY: number = -10 - (Math.random() * 20); // -10vh to -30vh

        // Random horizontal drift
        const drift: number = (Math.random() - 0.5) * 100; // -50px to +50px

        // Random size variation
        const size: number = 4 + Math.random() * 3; // 4-7px

        flake.style.left = `${startLeft}vw`;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.animationDuration = `${duration}ms`;
        flake.style.setProperty('--drift', `${drift}px`);
        flake.style.setProperty('--start-y', `${startY}vh`);

        if (snowLayer) {
            snowLayer.appendChild(flake);
        }

        // Remove from DOM after animation completes
        setTimeout(() => {
            if (snowLayer && flake.parentNode === snowLayer) {
                snowLayer.removeChild(flake);
            }
        }, duration + 100);
    };

    // Create initial batch of snowflakes
    for (let i: number = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 100);
    }

    // Continuously create new snowflakes
    snowIntervalId = window.setInterval(createSnowflake, 300);
}

/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", (): void => {
    // Generate waves immediately (but they won't be visible through blur)
    generateRandomWaves();

    // Wait for user to click start button
    if (startButton) {
        startButton.addEventListener("click", startExperience);
    }
});

/**
 * Cleanup function (useful if you navigate away)
 */
window.addEventListener("beforeunload", (): void => {
    if (birdGenerationIntervalId !== null) {
        clearInterval(birdGenerationIntervalId);
    }
    if (snowIntervalId !== null) {
        clearInterval(snowIntervalId);
    }
    if (heroAudio) {
        heroAudio.pause();
    }
});