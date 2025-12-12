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
var waveImages = [
    "src/public/images/hero/hero_wave_dark_l.png",
    "src/public/images/hero/hero_wave_light_l.png",
    "src/public/images/hero/hero_wave_dark_s.png",
    "src/public/images/hero/hero_wave_light_s.png"
];
function generateRandomWaves() {
    if (!heroScene)
        return;
    var numberOfWaves = 30 + Math.floor(Math.random() * 11);
    var seaHeightPercent = 55;
    var seaStartPercent = 0;
    for (var i = 0; i < numberOfWaves; i++) {
        var wave = document.createElement("img");
        var randomImage = waveImages[Math.floor(Math.random() * waveImages.length)];
        wave.src = randomImage;
        wave.alt = "";
        wave.className = "hero__wave hero__wave--generated";
        var left = Math.random() * 100;
        var wavePositionInSea = 0.1 + Math.random() * 0.7;
        var bottom = seaStartPercent + (seaHeightPercent * wavePositionInSea);
        var size = 4 + Math.random() * 6;
        var opacity = 0.3 + Math.random() * 0.6;
        var duration = 4 + Math.random() * 5;
        var delay = -Math.random() * duration;
        wave.style.position = "absolute";
        wave.style.left = "".concat(left, "%");
        wave.style.bottom = "".concat(bottom, "%");
        wave.style.width = "".concat(size, "%");
        wave.style.opacity = "".concat(opacity);
        wave.style.zIndex = "2";
        wave.style.animationDuration = "".concat(duration, "s");
        wave.style.animationDelay = "".concat(delay, "s");
        heroScene.appendChild(wave);
    }
}
document.addEventListener("DOMContentLoaded", function () {
    generateRandomWaves();
});
function createSeagull() {
    if (!heroScene)
        return;
    var bird = document.createElement("img");
    bird.src = birdFrames[0];
    bird.alt = "Seagull";
    bird.className = "hero__bird hero__bird--dynamic";
    var size = 6 + Math.random() * 4;
    var topPosition = 8 + Math.random() * 12;
    var duration = 10 + Math.random() * 6;
    bird.style.width = "".concat(size, "%");
    bird.style.top = "".concat(topPosition, "%");
    bird.style.animationDuration = "".concat(duration, "s");
    heroScene.appendChild(bird);
    var frameIndex = 0;
    var spriteInterval = setInterval(function () {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);
    setTimeout(function () {
        clearInterval(spriteInterval);
        if (bird.parentNode === heroScene) {
            heroScene.removeChild(bird);
        }
    }, duration * 1000 + 500);
}
function startSeagullGeneration() {
    createSeagull();
    birdGenerationIntervalId = window.setInterval(function () {
        createSeagull();
    }, 8000 + Math.random() * 7000);
}
