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

const waveImages: string[] = [
    "src/public/images/hero/hero_wave_dark_l.png",
    "src/public/images/hero/hero_wave_light_l.png",
    "src/public/images/hero/hero_wave_dark_s.png",
    "src/public/images/hero/hero_wave_light_s.png"
];

function generateRandomWaves(): void {
    if (!heroScene) return;

    const numberOfWaves: number = 30 + Math.floor(Math.random() * 11);
    const seaHeightPercent: number = 55;
    const seaStartPercent: number = 0;

    for (let i: number = 0; i < numberOfWaves; i++) {
        const wave: HTMLImageElement = document.createElement("img");
        const randomImage: string = waveImages[Math.floor(Math.random() * waveImages.length)];
        wave.src = randomImage;
        wave.alt = "";
        wave.className = "hero__wave hero__wave--generated";

        const left: number = Math.random() * 100;
        const wavePositionInSea: number = 0.1 + Math.random() * 0.7;
        const bottom: number = seaStartPercent + (seaHeightPercent * wavePositionInSea);
        const size: number = 4 + Math.random() * 6;
        const opacity: number = 0.3 + Math.random() * 0.6;
        const duration: number = 4 + Math.random() * 5;
        const delay: number = -Math.random() * duration;

        wave.style.position = "absolute";
        wave.style.left = `${left}%`;
        wave.style.bottom = `${bottom}%`;
        wave.style.width = `${size}%`;
        wave.style.opacity = `${opacity}`;
        wave.style.zIndex = "2";
        wave.style.animationDuration = `${duration}s`;
        wave.style.animationDelay = `${delay}s`;

        heroScene.appendChild(wave);
    }
}

document.addEventListener("DOMContentLoaded", (): void => {
    generateRandomWaves();
});
