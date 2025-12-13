// =====================
// HERO SECTION
// =====================

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
let manualCrossfadeInProgress: boolean = false;

// Track generated family to prevent unnecessary regeneration
let generatedFamily: FamilyMember[] = [];
let lastMainCharacterKey: string = '';

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
}

/**
 * Create a single seagull with random properties
 */
function createSeagull(): void {
    if (!heroScene) return;

    const bird: HTMLImageElement = document.createElement("img");
    bird.src = birdFrames[0];
    bird.alt = "Seagull";
    bird.className = "hero__bird hero__bird--dynamic";

    const size: number = 6 + Math.random() * 4;
    const topPosition: number = 8 + Math.random() * 12;
    const duration: number = 10 + Math.random() * 6;

    bird.style.width = `${size}%`;
    bird.style.top = `${topPosition}%`;
    bird.style.animationDuration = `${duration}s`;

    heroScene.appendChild(bird);

    let frameIndex: number = 0;
    const spriteInterval = setInterval(() => {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);

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
    createSeagull();
    birdGenerationIntervalId = window.setInterval(() => {
        createSeagull();
    }, 8000 + Math.random() * 7000);
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
 */
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

/**
 * Create continuous snowfall effect
 */
function startSnowfall(): void {
    if (!snowLayer) return;

    const createSnowflake = (): void => {
        const flake: HTMLDivElement = document.createElement("div");
        flake.className = "snowflake";

        const startLeft: number = Math.random() * 100;
        const duration: number = 8000 + Math.random() * 6000;
        const startY: number = -10 - (Math.random() * 20);
        const drift: number = (Math.random() - 0.5) * 100;
        const size: number = 4 + Math.random() * 3;

        flake.style.left = `${startLeft}vw`;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.animationDuration = `${duration}ms`;
        flake.style.setProperty('--drift', `${drift}px`);
        flake.style.setProperty('--start-y', `${startY}vh`);

        if (snowLayer) {
            snowLayer.appendChild(flake);
        }

        setTimeout(() => {
            if (snowLayer && flake.parentNode === snowLayer) {
                snowLayer.removeChild(flake);
            }
        }, duration + 100);
    };

    for (let i: number = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 100);
    }

    snowIntervalId = window.setInterval(createSnowflake, 300);
}

// =====================
// SEARCH SECTION
// =====================

// TypeScript Types
type Gender = 'male' | 'female';
type TicketClass = 1 | 2 | 3;
type Port = 'southampton' | 'cherbourg' | 'queenstown';
type AgeBucket = 'baby' | 'child' | 'youngAdult' | 'adult' | 'senior';
type FamilySize = 2 | 3 | 4;

interface PassengerState {
    port: Port | null;
    age: number | null;
    gender: Gender | null;
    ticketClass: TicketClass | null;
    travelWithFamily: boolean;
    familySize: FamilySize | null;
}

interface FamilyMember {
    gender: Gender;
    age: number;
    ageBucket: AgeBucket;
    ticketClass: TicketClass;
    position: number; // horizontal position %
    zIndex: number;
    isMainCharacter: boolean;
}

// Initialize passenger state
const passengerState: PassengerState = {
    port: 'southampton', // Default to Southampton for background
    age: 30, // Default age from slider
    gender: null,
    ticketClass: null,
    travelWithFamily: false,
    familySize: null
};

// Track last rendered character to avoid unnecessary re-renders
let lastRenderedCharacter: string | null = null;

// Port background images
const PORT_BACKGROUNDS: Record<Port, string> = {
    southampton: 'src/public/images/search/ports/southampton.png',
    cherbourg: 'src/public/images/search/ports/cherbourg.png',
    queenstown: 'src/public/images/search/ports/queenstown.png'
};

// DOM Elements
const searchPreview = document.getElementById('search-preview') as HTMLElement | null;
const previewBackground = document.getElementById('preview-background') as HTMLElement | null;
const previewCharacterLayer = document.getElementById('preview-character-layer') as HTMLElement | null;
const previewSeagulls = document.getElementById('preview-seagulls') as HTMLElement | null;
const previewSnow = document.getElementById('preview-snow') as HTMLElement | null;
const ageSlider = document.getElementById('age') as HTMLInputElement | null;
const ageValue = document.getElementById('age-value') as HTMLElement | null;
const familyCheckbox = document.getElementById('travelWithFamily') as HTMLInputElement | null;
const familySizeField = document.getElementById('family-size-field') as HTMLElement | null;
const calculateButton = document.getElementById('calculate-button') as HTMLButtonElement | null;
const harborAudio = document.getElementById('harbor-audio') as HTMLAudioElement | null;

let searchSnowIntervalId: number | null = null;
let searchBirdIntervalId: number | null = null;

/**
 * Age to bucket mapping (boundaries: 0-4, 4-14, 14-30, 30-50, 50+)
 * Rule: Lower bound inclusive, upper bound exclusive
 */
function getAgeBucket(age: number): AgeBucket {
    if (age < 4) return 'baby';
    if (age < 14) return 'child';
    if (age < 30) return 'youngAdult';
    if (age < 50) return 'adult';
    return 'senior';
}

/**
 * Convert age bucket to filename token
 */
function ageBucketToToken(bucket: AgeBucket): 'b' | 'c' | 'ya' | 'a' | 's' {
    const tokenMap: Record<AgeBucket, 'b' | 'c' | 'ya' | 'a' | 's'> = {
        baby: 'b',
        child: 'c',
        youngAdult: 'ya',
        adult: 'a',
        senior: 's'
    };
    return tokenMap[bucket];
}

/**
 * Get random age within a bucket
 */
function getRandomAgeInBucket(bucket: AgeBucket): number {
    const ranges: Record<AgeBucket, [number, number]> = {
        baby: [0, 3],
        child: [4, 13],
        youngAdult: [14, 29],
        adult: [30, 49],
        senior: [50, 80]
    };
    const [min, max] = ranges[bucket];
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get opposite gender
 */
function getOppositeGender(gender: Gender): Gender {
    return gender === 'male' ? 'female' : 'male';
}

/**
 * Get random gender
 */
function getRandomGender(): Gender {
    return Math.random() < 0.5 ? 'male' : 'female';
}

/**
 * Check if family has duplicate appearances (same gender + ageBucket + class)
 */
function hasDuplicateAppearance(family: FamilyMember[]): boolean {
    const appearances = new Set<string>();

    for (const member of family) {
        const key = `${member.gender}_${member.ageBucket}_${member.ticketClass}`;
        if (appearances.has(key)) {
            return true;
        }
        appearances.add(key);
    }

    return false;
}

/**
 * Generate family members based on main character
 * Only regenerates if main character's key characteristics change
 */
function generateFamilyMembers(mainPassenger: PassengerState): FamilyMember[] {
    if (!mainPassenger.travelWithFamily || !mainPassenger.familySize) {
        generatedFamily = [];
        lastMainCharacterKey = '';
        return [];
    }

    const mainBucket = getAgeBucket(mainPassenger.age!);
    const currentFamilySize = mainPassenger.familySize;

    // Create key based on characteristics that matter for family generation
    // (gender and ageBucket - NOT class or exact age)
    const mainCharacterKey = `${mainPassenger.gender}_${mainBucket}`;

    // Check if we need to regenerate
    const needsRegeneration = lastMainCharacterKey !== mainCharacterKey;
    const needsMoreMembers = generatedFamily.length < (currentFamilySize - 1);
    const hasTooManyMembers = generatedFamily.length > (currentFamilySize - 1);

    if (!needsRegeneration && !needsMoreMembers && !hasTooManyMembers) {
        // Just update class for existing family members
        generatedFamily.forEach(member => {
            member.ticketClass = mainPassenger.ticketClass!;
        });
        return generatedFamily;
    }

    if (needsRegeneration) {
        // Main character changed significantly - regenerate completely
        generatedFamily = [];
        lastMainCharacterKey = mainCharacterKey;
    }

    const membersToGenerate = currentFamilySize - 1; // Exclude main character
    const membersNeeded = membersToGenerate - generatedFamily.length;

    if (membersNeeded > 0) {
        // Add new members to existing family
        const newMembers: FamilyMember[] = [];
        const ticketClass = mainPassenger.ticketClass!;

        // Count existing adult-age members (including main character)
        const mainIsAdultAge = mainBucket === 'youngAdult' || mainBucket === 'adult' || mainBucket === 'senior';
        const existingAdultAgeCount = generatedFamily.filter(m =>
            m.ageBucket === 'youngAdult' || m.ageBucket === 'adult' || m.ageBucket === 'senior'
        ).length + (mainIsAdultAge ? 1 : 0);

        // If we already have 2+ adult-age people, force next members to be children
        if (existingAdultAgeCount >= 2) {
            // Force children for remaining members
            for (let i = 0; i < membersNeeded; i++) {
                const existingChildBuckets = new Set(
                    [...generatedFamily, ...newMembers]
                        .filter(m => m.ageBucket === 'baby' || m.ageBucket === 'child')
                        .map(m => m.ageBucket)
                );

                let childBucket: AgeBucket;
                if (!existingChildBuckets.has('baby')) {
                    childBucket = 'baby';
                } else if (!existingChildBuckets.has('child')) {
                    childBucket = 'child';
                } else {
                    // Both exist, pick randomly
                    childBucket = Math.random() < 0.5 ? 'baby' : 'child';
                }

                newMembers.push({
                    gender: getRandomGender(),
                    ageBucket: childBucket,
                    age: getRandomAgeInBucket(childBucket),
                    ticketClass,
                    position: 0,
                    zIndex: 0,
                    isMainCharacter: false
                });
            }
        } else {
            // Generate based on main character's age group (normal logic)
            switch (mainBucket) {
                case 'baby':
                case 'child':
                    generateChildFamily(mainPassenger, membersNeeded, newMembers);
                    break;
                case 'youngAdult':
                    generateYoungAdultFamily(mainPassenger, membersNeeded, newMembers);
                    break;
                case 'adult':
                    generateAdultFamily(mainPassenger, membersNeeded, newMembers);
                    break;
                case 'senior':
                    generateSeniorFamily(mainPassenger, membersNeeded, newMembers);
                    break;
            }
        }

        // Ensure new members don't duplicate existing ones
        const existingKeys = new Set(
            generatedFamily.map(m => `${m.gender}_${m.ageBucket}`)
        );

        const uniqueNewMembers = newMembers.filter(member => {
            const key = `${member.gender}_${member.ageBucket}`;
            if (existingKeys.has(key)) {
                return false;
            }
            existingKeys.add(key);
            return true;
        });

        generatedFamily.push(...uniqueNewMembers);

        // If we still need more and couldn't generate unique ones, try alternatives
        while (generatedFamily.length < membersToGenerate && generatedFamily.length < 3) {
            const altMember = generateAlternativeMember(mainPassenger, existingKeys);
            if (altMember) {
                generatedFamily.push(altMember);
                existingKeys.add(`${altMember.gender}_${altMember.ageBucket}`);
            } else {
                break; // Can't generate more unique members
            }
        }
    } else if (membersNeeded < 0) {
        // Remove excess members
        generatedFamily = generatedFamily.slice(0, membersToGenerate);
    }

    // Update ticket class for all members
    generatedFamily.forEach(member => {
        member.ticketClass = mainPassenger.ticketClass!;
    });

    return generatedFamily;
}

/**
 * Generate an alternative family member to avoid duplicates
 */
function generateAlternativeMember(
    mainPassenger: PassengerState,
    usedKeys: Set<string>
): FamilyMember | null {
    const ticketClass = mainPassenger.ticketClass!;
    const availableBuckets: AgeBucket[] = ['baby', 'child', 'youngAdult', 'adult', 'senior'];
    const genders: Gender[] = ['male', 'female'];

    // Try all combinations
    for (const bucket of availableBuckets) {
        for (const gender of genders) {
            const key = `${gender}_${bucket}`;
            if (!usedKeys.has(key)) {
                return {
                    gender,
                    ageBucket: bucket,
                    age: getRandomAgeInBucket(bucket),
                    ticketClass,
                    position: 0,
                    zIndex: 0,
                    isMainCharacter: false
                };
            }
        }
    }

    return null; // All combinations used
}


/**
 * Generate family for baby/child main character
 */
function generateChildFamily(main: PassengerState, count: number, family: FamilyMember[]): void {
    const ticketClass = main.ticketClass!;

    if (count >= 1) {
        // First parent
        const parent1Gender = getRandomGender();
        family.push({
            gender: parent1Gender,
            ageBucket: Math.random() < 0.7 ? 'adult' : 'youngAdult',
            age: getRandomAgeInBucket(Math.random() < 0.7 ? 'adult' : 'youngAdult'),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 2) {
        // Second parent (opposite gender)
        family.push({
            gender: getOppositeGender(family[0].gender),
            ageBucket: family[0].ageBucket, // Same age group as first parent
            age: getRandomAgeInBucket(family[0].ageBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 3) {
        // Sibling - different age bucket than main character
        const mainBucket = getAgeBucket(main.age!);
        const siblingBucket: AgeBucket = mainBucket === 'baby' ? 'child' : 'baby';

        family.push({
            gender: getRandomGender(),
            ageBucket: siblingBucket,
            age: getRandomAgeInBucket(siblingBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }
}

/**
 * Generate family for young adult main character
 */
function generateYoungAdultFamily(main: PassengerState, count: number, family: FamilyMember[]): void {
    const ticketClass = main.ticketClass!;
    const mainGender = main.gender!;

    if (count >= 1) {
        // Spouse or parent (50/50 chance)
        const isSpouse = Math.random() < 0.5;
        family.push({
            gender: getOppositeGender(mainGender),
            ageBucket: isSpouse ? 'youngAdult' : 'adult',
            age: getRandomAgeInBucket(isSpouse ? 'youngAdult' : 'adult'),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 2) {
        // Second member: If first was spouse (youngAdult/adult), add child
        // If first was parent (adult), add spouse or child
        const firstMember = family[0];

        if (firstMember.ageBucket === 'youngAdult' || firstMember.ageBucket === 'adult') {
            // First member is adult-age, so add child
            const childBucket: AgeBucket = Math.random() < 0.5 ? 'baby' : 'child';
            family.push({
                gender: getRandomGender(),
                ageBucket: childBucket,
                age: getRandomAgeInBucket(childBucket),
                ticketClass,
                position: 0,
                zIndex: 0,
                isMainCharacter: false
            });
        }
    }

    if (count >= 3) {
        // Third member: ensure different bucket from second
        const secondMember = family[1];
        let thirdBucket: AgeBucket;

        if (secondMember.ageBucket === 'baby') {
            thirdBucket = 'child';
        } else if (secondMember.ageBucket === 'child') {
            thirdBucket = 'baby';
        } else {
            // Shouldn't happen, but fallback to child
            thirdBucket = 'child';
        }

        family.push({
            gender: getRandomGender(),
            ageBucket: thirdBucket,
            age: getRandomAgeInBucket(thirdBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }
}

/**
 * Generate family for adult main character
 */
function generateAdultFamily(main: PassengerState, count: number, family: FamilyMember[]): void {
    const ticketClass = main.ticketClass!;
    const mainGender = main.gender!;

    if (count >= 1) {
        // Spouse
        const spouseBucket: AgeBucket = Math.random() < 0.7 ? 'adult' : 'youngAdult';
        family.push({
            gender: getOppositeGender(mainGender),
            ageBucket: spouseBucket,
            age: getRandomAgeInBucket(spouseBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 2) {
        // First child
        const childBucket: AgeBucket = Math.random() < 0.5 ? 'baby' : 'child';
        family.push({
            gender: getRandomGender(),
            ageBucket: childBucket,
            age: getRandomAgeInBucket(childBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 3) {
        // Second child - different bucket
        const firstChildBucket = family[1].ageBucket;
        const secondChildBucket: AgeBucket = firstChildBucket === 'baby' ? 'child' : 'baby';
        family.push({
            gender: getRandomGender(),
            ageBucket: secondChildBucket,
            age: getRandomAgeInBucket(secondChildBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }
}

/**
 * Generate family for senior main character
 */
function generateSeniorFamily(main: PassengerState, count: number, family: FamilyMember[]): void {
    const ticketClass = main.ticketClass!;
    const mainGender = main.gender!;

    if (count >= 1) {
        // Spouse
        const spouseBucket: AgeBucket = Math.random() < 0.7 ? 'senior' : 'adult';
        family.push({
            gender: getOppositeGender(mainGender),
            ageBucket: spouseBucket,
            age: getRandomAgeInBucket(spouseBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 2) {
        // Adult child
        const adultChildBucket: AgeBucket = Math.random() < 0.5 ? 'adult' : 'youngAdult';
        family.push({
            gender: getRandomGender(),
            ageBucket: adultChildBucket,
            age: getRandomAgeInBucket(adultChildBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }

    if (count >= 3) {
        // Grandchild
        const grandchildBucket: AgeBucket = Math.random() < 0.5 ? 'baby' : 'child';
        family.push({
            gender: getRandomGender(),
            ageBucket: grandchildBucket,
            age: getRandomAgeInBucket(grandchildBucket),
            ticketClass,
            position: 0,
            zIndex: 0,
            isMainCharacter: false
        });
    }
}

/**
 * Generate character filename based on passenger data
 */
function getCharacterAsset(passenger: {
    gender: Gender;
    age: number;
    ticketClass: TicketClass;
}): string {
    const genderToken = passenger.gender === 'male' ? 'm' : 'f';
    const ageBucket = getAgeBucket(passenger.age);
    const ageToken = ageBucketToToken(ageBucket);
    const classToken = passenger.ticketClass.toString();

    const filename = `${genderToken}_${ageToken}_${classToken}.png`;
    return `src/public/images/search/characters/${filename}`;
}

/**
 * Check if main passenger character should be displayed
 * (doesn't require family size to be selected)
 */
function isMainCharacterReady(state: PassengerState): boolean {
    return (
        state.port !== null &&
        state.age !== null &&
        state.gender !== null &&
        state.ticketClass !== null
    );
}

/**
 * Check if entire passenger profile is complete (including family)
 * (required for Calculate button to be enabled)
 */
function isPassengerComplete(state: PassengerState): boolean {
    return (
        isMainCharacterReady(state) &&
        (!state.travelWithFamily || state.familySize !== null)
    );
}

/**
 * Update preview background based on selected port
 */
function updatePreviewBackground(): void {
    if (!previewBackground) return;

    if (passengerState.port) {
        previewBackground.style.backgroundImage = `url('${PORT_BACKGROUNDS[passengerState.port]}')`;
        previewBackground.classList.add('search__preview-background--visible');
    } else {
        previewBackground.classList.remove('search__preview-background--visible');
    }
}

/**
 * Update character in preview
 * Shows main character and family members if applicable
 */
function updatePreviewCharacter(): void {
    if (!previewCharacterLayer) return;

    // Show character if main passenger data is complete (ignore family size)
    if (isMainCharacterReady(passengerState)) {
        // Generate family members
        const familyMembers = generateFamilyMembers(passengerState);

        // Create main character as family member
        const mainCharacter: FamilyMember = {
            gender: passengerState.gender!,
            age: passengerState.age!,
            ageBucket: getAgeBucket(passengerState.age!),
            ticketClass: passengerState.ticketClass!,
            position: 0,
            zIndex: 0,
            isMainCharacter: true
        };

        // Combine and sort by age
        const allMembers = [mainCharacter, ...familyMembers];
        allMembers.sort((a, b) => a.age - b.age);

        // Assign positions and z-index
        allMembers.forEach((member, index) => {
            member.position = calculatePosition(index, allMembers.length);
            member.zIndex = allMembers.length - index;
        });

        // Generate cache key for current family composition
        const familyKey = allMembers
            .map(m => `${m.gender}_${m.ageBucket}_${m.ticketClass}_${m.position}`)
            .join('|');

        // Only re-render if family composition changed
        if (familyKey === lastRenderedCharacter) {
            return;
        }

        lastRenderedCharacter = familyKey;

        // Clear existing characters
        previewCharacterLayer.innerHTML = '';

        // Render all family members
        allMembers.forEach(member => {
            const characterPath = getCharacterAsset({
                gender: member.gender,
                age: member.age,
                ticketClass: member.ticketClass
            });

            const character = document.createElement('img');
            character.className = 'search__character';
            character.src = characterPath;
            character.alt = member.isMainCharacter ? 'Your character' : 'Family member';

            // Positioning and styling
            character.style.position = 'absolute';
            character.style.left = `${member.position}%`;
            character.style.bottom = '0';
            character.style.transform = 'translateX(-50%)';
            character.style.zIndex = member.zIndex.toString();

            // Different styling for main vs family
            if (member.isMainCharacter) {
                character.style.filter = 'contrast(1.3)';
                character.style.opacity = '1';
            } else {
                character.style.filter = 'contrast(1.0)';
                character.style.opacity = '0.9';
            }

            // Handle missing image
            character.onerror = () => {
                character.src = 'src/public/images/search/characters/placeholder.png';
            };

            // Add to preview
            previewCharacterLayer.appendChild(character);

            // Trigger visible animation
            setTimeout(() => {
                character.classList.add('search__character--visible');
            }, 50 + (allMembers.indexOf(member) * 100)); // Stagger animations
        });

    } else {
        // Clear character if profile incomplete
        if (lastRenderedCharacter !== null) {
            previewCharacterLayer.innerHTML = '';
            lastRenderedCharacter = null;
        }
    }
}

/**
 * Calculate horizontal position for family member
 */
function calculatePosition(index: number, total: number): number {
    if (total === 1) return 50; // Center if alone

    // Spread across almost full width for all family sizes
    // Family 2: 30%, 70%
    // Family 3: 20%, 50%, 80%
    // Family 4: 15%, 35%, 65%, 85%

    if (total === 2) {
        const positions = [30, 70];
        return positions[index];
    } else if (total === 3) {
        const positions = [20, 50, 80];
        return positions[index];
    } else {
        // Family of 4: spread across 70% of width (15% to 85%)
        const positions = [15, 35, 65, 85];
        return positions[index];
    }
}

/**
 * Update calculate button state
 */
function updateButtonState(): void {
    if (calculateButton) {
        calculateButton.disabled = !isPassengerComplete(passengerState);
    }
}

/**
 * Update all preview elements
 */
function updatePreview(): void {
    updatePreviewBackground();
    updatePreviewCharacter();
    updateButtonState();
}

/**
 * Handle option button clicks (port, gender, class, family size)
 */
function handleOptionButtonClick(button: HTMLButtonElement): void {
    const field = button.dataset.field;
    const value = button.dataset.value;

    if (!field || !value) return;

    // Remove active class from siblings
    const siblings = button.parentElement?.querySelectorAll(`[data-field="${field}"]`);
    siblings?.forEach(btn => btn.classList.remove('search__option-button--active', 'search__icon-button--active'));

    // Add active class to clicked button
    if (button.classList.contains('search__icon-button')) {
        button.classList.add('search__icon-button--active');
    } else {
        button.classList.add('search__option-button--active');
    }

    // Update state
    switch (field) {
        case 'port':
            passengerState.port = value as Port;
            break;
        case 'gender':
            passengerState.gender = value as Gender;
            break;
        case 'ticketClass':
            passengerState.ticketClass = parseInt(value) as TicketClass;
            break;
        case 'familySize':
            passengerState.familySize = parseInt(value) as FamilySize;
            break;
    }

    updatePreview();
}

/**
 * Handle age slider change
 */
function handleAgeChange(): void {
    if (!ageSlider || !ageValue) return;

    const age = parseInt(ageSlider.value, 10);
    passengerState.age = age;
    ageValue.textContent = age.toString();

    updatePreview();
}

/**
 * Handle family checkbox change
 */
function handleFamilyCheckboxChange(): void {
    if (!familyCheckbox || !familySizeField) return;

    passengerState.travelWithFamily = familyCheckbox.checked;

    if (familyCheckbox.checked) {
        familySizeField.style.display = 'flex';
    } else {
        familySizeField.style.display = 'none';
        passengerState.familySize = null;
        // Remove active state from family size buttons
        familySizeField.querySelectorAll('.search__option-button').forEach(btn => {
            btn.classList.remove('search__option-button--active');
        });
    }

    updatePreview();
}

/**
 * Initialize Search section
 */
function initSearchSection(): void {
    console.log('🚀 initSearchSection() called!');
    console.log('🎯 About to start snow and seagulls...');

    // Set default port (Southampton) as active
    const defaultPortButton = document.querySelector('[data-field="port"][data-value="southampton"]');
    if (defaultPortButton) {
        defaultPortButton.classList.add('search__option-button--active');
    }

    // Attach event listeners to all option buttons
    document.querySelectorAll('[data-field]').forEach(button => {
        button.addEventListener('click', () => handleOptionButtonClick(button as HTMLButtonElement));
    });

    // Age slider
    if (ageSlider) {
        ageSlider.addEventListener('input', handleAgeChange);
        // Set initial value display
        handleAgeChange();
    }

    // Family checkbox
    if (familyCheckbox) {
        familyCheckbox.addEventListener('change', handleFamilyCheckboxChange);
    }

    // Initial preview update (will show Southampton background)
    updatePreview();

    // Start atmospheric effects
    startSearchSnowfall();
    startSearchSeagulls();
}

/**
 * Create snowfall in search preview
 */
function startSearchSnowfall(): void {
    console.log('🌨️ Starting search snowfall...');
    console.log('previewBackground element:', previewBackground);

    if (!previewBackground) {
        console.error('❌ previewBackground is null!');
        return;
    }

    const createSnowflake = (): void => {
        const flake = document.createElement("div");
        flake.className = "snowflake";

        // Set inline styles for guaranteed positioning
        flake.style.cssText = `
            position: absolute;
            left: ${Math.random() * 100}%;
            top: 0;
            width: ${4 + Math.random() * 3}px;
            height: ${4 + Math.random() * 3}px;
            border-radius: 50%;
            background-color: rgba(173, 216, 230, 0.8);
            box-shadow: 0 0 3px rgba(173, 216, 230, 0.6);
            pointer-events: none;
            z-index: 10;
        `;

        const duration = 8000 + Math.random() * 6000;
        const drift = (Math.random() - 0.5) * 100;

        flake.style.animationDuration = `${duration}ms`;
        flake.style.setProperty('--start-y', '0vh');
        flake.style.setProperty('--drift', `${drift}px`);

        previewBackground.appendChild(flake);

        setTimeout(() => {
            if (previewBackground && flake.parentNode === previewBackground) {
                previewBackground.removeChild(flake);
            }
        }, duration + 100);
    };

    // Initial burst of snowflakes
    console.log('Creating initial 20 snowflakes...');
    for (let i = 0; i < 20; i++) {
        setTimeout(createSnowflake, i * 200);
    }

    // Continuous snowfall
    searchSnowIntervalId = window.setInterval(createSnowflake, 500);
    console.log('✅ Snow interval started');
}

/**
 * Create a seagull in search preview
 */
function createSearchSeagull(): void {
    if (!previewBackground) return;

    const bird: HTMLImageElement = document.createElement("img");
    bird.src = birdFrames[0];
    bird.alt = "Seagull";
    bird.className = "search__seagull";

    const size: number = 8 + Math.random() * 4;
    const topPosition: number = 15 + Math.random() * 30;
    const duration: number = 12 + Math.random() * 8;

    bird.style.width = `${size}%`;
    bird.style.top = `${topPosition}%`;
    bird.style.left = '-15%';
    bird.style.position = 'absolute';
    bird.style.animationDuration = `${duration}s`;

    previewBackground.appendChild(bird);

    // Animate sprite frames
    let frameIndex: number = 0;
    const spriteInterval = setInterval(() => {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);

    // Remove after animation
    setTimeout(() => {
        clearInterval(spriteInterval);
        if (bird.parentNode === previewBackground) {
            previewBackground.removeChild(bird);
        }
    }, duration * 1000 + 500);
}

/**
 * Start generating seagulls in search preview
 */
function startSearchSeagulls(): void {
    createSearchSeagull();
    searchBirdIntervalId = window.setInterval(() => {
        createSearchSeagull();
    }, 10000 + Math.random() * 8000);
}

/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", (): void => {
    console.log('🌟 DOM Content Loaded!');
    console.log('📍 Current script version: SNOW-DEBUG-v2');

    // Always scroll to top on page load/refresh
    window.scrollTo(0, 0);

    // Generate waves for Hero
    generateRandomWaves();

    // Wait for user to click start button
    if (startButton) {
        startButton.addEventListener("click", startExperience);
    }

    // Initialize Search section
    initSearchSection();

    // Scroll Hero CTA to Search with smooth behavior and audio crossfade
    if (heroCta) {
        heroCta.addEventListener("click", (): void => {
            const searchSection = document.getElementById("search");
            if (searchSection) {
                // Start audio crossfade immediately
                crossfadeAudio('hero-to-search');

                // Then scroll
                searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }

    // Audio crossfade between sections
    setupAudioTransitions();
});

/**
 * Crossfade between audio tracks smoothly
 */
function crossfadeAudio(direction: 'hero-to-search' | 'search-to-hero'): void {
    if (!heroAudio || !harborAudio) return;

    manualCrossfadeInProgress = true;

    const fadeDuration = 1500; // 1.5 seconds
    const steps = 30; // 30 steps = smooth transition
    const stepDuration = fadeDuration / steps;

    let currentStep = 0;

    const fadeInterval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps; // 0.0 to 1.0

        if (direction === 'hero-to-search') {
            // Fade out hero
            heroAudio.volume = Math.max(0, 0.8 * (1 - progress));

            // Fade in harbor
            if (harborAudio.paused && experienceStarted) {
                harborAudio.play().catch(err => console.log("Harbor audio play error:", err));
            }
            harborAudio.volume = Math.min(0.8, 0.8 * progress);

            // Stop hero when fully faded
            if (currentStep >= steps) {
                heroAudio.pause();
                heroAudio.currentTime = 0;
                clearInterval(fadeInterval);
                manualCrossfadeInProgress = false;
            }
        } else {
            // Fade out harbor
            harborAudio.volume = Math.max(0, 0.8 * (1 - progress));

            // Fade in hero
            if (heroAudio.paused && experienceStarted) {
                heroAudio.currentTime = 0;
                heroAudio.play().catch(err => console.log("Hero audio play error:", err));
            }
            heroAudio.volume = Math.min(0.8, 0.8 * progress);

            // Stop harbor when fully faded
            if (currentStep >= steps) {
                harborAudio.pause();
                harborAudio.currentTime = 0;
                clearInterval(fadeInterval);
                manualCrossfadeInProgress = false;
            }
        }
    }, stepDuration);
}

/**
 * Setup audio transitions between Hero and Search sections
 */
function setupAudioTransitions(): void {
    if (!heroAudio || !harborAudio) return;

    // Set initial volumes
    heroAudio.volume = 0.8;
    harborAudio.volume = 0;

    const heroSection = document.querySelector('.hero') as HTMLElement | null;
    const searchSection = document.getElementById('search') as HTMLElement | null;

    if (!heroSection || !searchSection) return;

    // More threshold steps for smoother transitions (21 steps = every 5%)
    const options: IntersectionObserverInit = {
        root: null,
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
    };

    // Observer for Search section
    const searchObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Don't interfere if manual crossfade is in progress
            if (manualCrossfadeInProgress) return;

            const ratio = entry.intersectionRatio;

            if (ratio > 0.05) {
                // Search section becoming visible

                // Fade out hero audio smoothly (stops at 0.3 ratio)
                if (heroAudio && !heroAudio.paused) {
                    if (ratio > 0.3) {
                        // Stop hero completely after 30% search visible
                        heroAudio.pause();
                        heroAudio.currentTime = 0;
                    } else {
                        // Smooth fade out from 5% to 30%
                        const fadeRatio = 1 - (ratio / 0.3); // 1.0 at 5%, 0.0 at 30%
                        heroAudio.volume = Math.max(0, 0.8 * fadeRatio);
                    }
                }

                // Start harbor audio and fade in smoothly
                if (harborAudio.paused && experienceStarted) {
                    harborAudio.play().catch(err => console.log("Harbor audio play error:", err));
                }

                // Smooth fade in from 5% to 60%
                if (ratio <= 0.6) {
                    const fadeInRatio = ratio / 0.6; // 0.0 at 5%, 1.0 at 60%
                    harborAudio.volume = Math.min(0.8, fadeInRatio * 0.8);
                } else {
                    harborAudio.volume = 0.8;
                }
            } else {
                // Search section not visible - stop harbor audio
                harborAudio.volume = 0;
                if (!harborAudio.paused) {
                    harborAudio.pause();
                    harborAudio.currentTime = 0;
                }

                // Resume hero audio only if hero is visible and experience started
                if (experienceStarted && heroAudio.paused) {
                    const heroRect = heroSection.getBoundingClientRect();
                    const heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;

                    if (heroVisible) {
                        heroAudio.currentTime = 0; // Restart from beginning
                        heroAudio.volume = 0.8;
                        heroAudio.play().catch(err => console.log("Hero audio play error:", err));
                    }
                }
            }
        });
    }, options);

    searchObserver.observe(searchSection);
}

/**
 * Cleanup function
 */
window.addEventListener("beforeunload", (): void => {
    if (birdGenerationIntervalId !== null) {
        clearInterval(birdGenerationIntervalId);
    }
    if (snowIntervalId !== null) {
        clearInterval(snowIntervalId);
    }
    if (searchSnowIntervalId !== null) {
        clearInterval(searchSnowIntervalId);
    }
    if (searchBirdIntervalId !== null) {
        clearInterval(searchBirdIntervalId);
    }
    if (heroAudio) {
        heroAudio.pause();
    }
    if (harborAudio) {
        harborAudio.pause();
    }
});