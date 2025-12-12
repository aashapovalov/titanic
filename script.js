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
