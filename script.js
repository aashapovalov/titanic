// Bird sprite frames
var birdFrames = [
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
var snowLayer = document.getElementById("snow-layer");
var heroCta = document.getElementById("hero-cta");
var heroAudio = document.getElementById("hero-audio");
var heroScene = document.querySelector(".hero__scene");
var startScreen = document.getElementById("start-screen");
var startButton = document.getElementById("start-button");
var snowIntervalId = null;
var birdGenerationIntervalId = null;
var experienceStarted = false;
/**
 * Start the entire experience - called when user clicks start button
 */
function startExperience() {
    if (experienceStarted)
        return;
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
        heroAudio.play().catch(function (error) {
            console.log("Audio play error:", error);
        });
    }
    // Start all animations immediately
    startSnowfall();
    // Start seagulls after 5 seconds
    setTimeout(function () {
        startSeagullGeneration();
    }, 5000);
    // Note: Waves are already generated, ship and trail animations
    // will now start playing due to .experience-started class
}
/**
 * Create a single seagull with random properties
 */
function createSeagull() {
    if (!heroScene)
        return;
    var bird = document.createElement("img");
    bird.src = birdFrames[0]; // Start with first frame
    bird.alt = "Seagull";
    bird.className = "hero__bird hero__bird--dynamic";
    // Random size variation (6-10% width)
    var size = 6 + Math.random() * 4;
    // Random top position (8-20% from top)
    var topPosition = 8 + Math.random() * 12;
    // Random flight duration (10-16 seconds)
    var duration = 10 + Math.random() * 6;
    bird.style.width = "".concat(size, "%");
    bird.style.top = "".concat(topPosition, "%");
    bird.style.animationDuration = "".concat(duration, "s");
    heroScene.appendChild(bird);
    // Animate sprite frames
    var frameIndex = 0;
    var spriteInterval = setInterval(function () {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);
    // Remove bird after animation completes
    setTimeout(function () {
        clearInterval(spriteInterval);
        if (bird.parentNode === heroScene) {
            heroScene.removeChild(bird);
        }
    }, duration * 1000 + 500);
}
/**
 * Start generating seagulls at intervals
 */
function startSeagullGeneration() {
    // Generate first bird immediately
    createSeagull();
    // Then generate new birds every 8-15 seconds
    birdGenerationIntervalId = window.setInterval(function () {
        createSeagull();
    }, 8000 + Math.random() * 7000); // 8-15 seconds
}
// Wave image paths
var waveImages = [
    "src/public/images/hero/hero_wave_dark_l.png",
    "src/public/images/hero/hero_wave_light_l.png",
    "src/public/images/hero/hero_wave_dark_s.png",
    "src/public/images/hero/hero_wave_light_s.png"
];
/**
 * Generate random waves dynamically
 * Waves are distributed across the sea surface and start animating immediately
 */
function generateRandomWaves() {
    if (!heroScene)
        return;
    var numberOfWaves = 30 + Math.floor(Math.random() * 11); // 30-40 waves
    // Sea layer is 55% of viewport height, starting from bottom
    var seaHeightPercent = 55; // Sea layer height in vh
    var seaStartPercent = 0; // Sea starts at bottom of viewport
    for (var i = 0; i < numberOfWaves; i++) {
        var wave = document.createElement("img");
        // Random wave image
        var randomImage = waveImages[Math.floor(Math.random() * waveImages.length)];
        wave.src = randomImage;
        wave.alt = "";
        wave.className = "hero__wave hero__wave--generated";
        // Random positioning - distributed across entire width
        var left = Math.random() * 100; // 0-100% - full horizontal spread
        // Position waves within sea layer only (10-80% of sea height)
        // Sea layer = bottom 0% to 55% of viewport
        // We want waves from 10% to 80% of that range
        var wavePositionInSea = 0.1 + Math.random() * 0.7; // 10% to 90% within sea
        var bottom = seaStartPercent + (seaHeightPercent * wavePositionInSea); // 5.5% to 44% of viewport
        // Random size (smaller waves are further back)
        var size = 4 + Math.random() * 6; // 4-10%
        // Random opacity (less opaque = further back)
        var opacity = 0.3 + Math.random() * 0.6; // 0.3-0.9
        // Random animation duration (slower = further back, faster = closer)
        var duration = 4 + Math.random() * 5; // 4-9 seconds
        // Random start point in animation cycle - makes waves start moving immediately
        var delay = -Math.random() * duration; // Negative delay = already in progress
        // Apply styles
        wave.style.position = "absolute";
        wave.style.left = "".concat(left, "%");
        wave.style.bottom = "".concat(bottom, "%");
        wave.style.width = "".concat(size, "%");
        wave.style.opacity = "".concat(opacity);
        wave.style.zIndex = "2"; // In front of sea (1), behind foreground elements
        wave.style.animationDuration = "".concat(duration, "s");
        wave.style.animationDelay = "".concat(delay, "s"); // Negative delay starts animation mid-cycle
        // Add to scene
        heroScene.appendChild(wave);
    }
}
/**
 * Create continuous snowfall effect
 * Generates snowflakes with random properties
 */
function startSnowfall() {
    if (!snowLayer)
        return;
    var createSnowflake = function () {
        var flake = document.createElement("div");
        flake.className = "snowflake";
        // Random horizontal start position
        var startLeft = Math.random() * 100;
        // Random fall duration (8-14 seconds)
        var duration = 8000 + Math.random() * 6000;
        // Random starting Y position (start from different heights for scattered effect)
        var startY = -10 - (Math.random() * 20); // -10vh to -30vh
        // Random horizontal drift
        var drift = (Math.random() - 0.5) * 100; // -50px to +50px
        // Random size variation
        var size = 4 + Math.random() * 3; // 4-7px
        flake.style.left = "".concat(startLeft, "vw");
        flake.style.width = "".concat(size, "px");
        flake.style.height = "".concat(size, "px");
        flake.style.animationDuration = "".concat(duration, "ms");
        flake.style.setProperty('--drift', "".concat(drift, "px"));
        flake.style.setProperty('--start-y', "".concat(startY, "vh"));
        if (snowLayer) {
            snowLayer.appendChild(flake);
        }
        // Remove from DOM after animation completes
        setTimeout(function () {
            if (snowLayer && flake.parentNode === snowLayer) {
                snowLayer.removeChild(flake);
            }
        }, duration + 100);
    };
    // Create initial batch of snowflakes
    for (var i = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 100);
    }
    // Continuously create new snowflakes
    snowIntervalId = window.setInterval(createSnowflake, 300);
}
/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", function () {
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
window.addEventListener("beforeunload", function () {
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
