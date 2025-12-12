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
