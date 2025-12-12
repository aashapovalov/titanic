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
