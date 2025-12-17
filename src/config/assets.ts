import { Port } from '../types';

// Bird animation frames
export const BIRD_FRAMES: string[] = [
    "images/hero/bird_ph1.png",
    "images/hero/bird_ph2.png",
    "images/hero/bird_ph3.png",
    "images/hero/bird_ph4.png",
    "images/hero/bird_ph5.png",
    "images/hero/bird_ph6.png",
    "images/hero/bird_ph7.png",
    "images/hero/bird_ph8.png",
    "images/hero/bird_ph9.png",
];

// Wave images
export const WAVE_IMAGES: string[] = [
    "images/hero/hero_wave_dark_l.png",
    "images/hero/hero_wave_light_l.png",
    "images/hero/hero_wave_dark_s.png",
    "images/hero/hero_wave_light_s.png"
];

// Audio files
export const AUDIO = {
    hero: "audio/hero_soundtrack.mp3",
    search: "audio/search-sound.mp3",
    resultHope: "audio/result_hope.mp3",
    resultSad: "audio/result_sad.mp3"
};

// Port backgrounds mapping
export const PORT_BACKGROUNDS: Record<Port, string> = {
    southampton: 'images/search/ports/southampton.png',
    cherbourg: 'images/search/ports/cherbourg.png',
    queenstown: 'images/search/ports/queenstown.png'
};