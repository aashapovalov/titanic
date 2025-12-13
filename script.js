// =====================
// HERO SECTION
// =====================
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
var manualCrossfadeInProgress = false;
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
}
/**
 * Create a single seagull with random properties
 */
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
/**
 * Start generating seagulls at intervals
 */
function startSeagullGeneration() {
    createSeagull();
    birdGenerationIntervalId = window.setInterval(function () {
        createSeagull();
    }, 8000 + Math.random() * 7000);
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
 */
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
/**
 * Create continuous snowfall effect
 */
function startSnowfall() {
    if (!snowLayer)
        return;
    var createSnowflake = function () {
        var flake = document.createElement("div");
        flake.className = "snowflake";
        var startLeft = Math.random() * 100;
        var duration = 8000 + Math.random() * 6000;
        var startY = -10 - (Math.random() * 20);
        var drift = (Math.random() - 0.5) * 100;
        var size = 4 + Math.random() * 3;
        flake.style.left = "".concat(startLeft, "vw");
        flake.style.width = "".concat(size, "px");
        flake.style.height = "".concat(size, "px");
        flake.style.animationDuration = "".concat(duration, "ms");
        flake.style.setProperty('--drift', "".concat(drift, "px"));
        flake.style.setProperty('--start-y', "".concat(startY, "vh"));
        if (snowLayer) {
            snowLayer.appendChild(flake);
        }
        setTimeout(function () {
            if (snowLayer && flake.parentNode === snowLayer) {
                snowLayer.removeChild(flake);
            }
        }, duration + 100);
    };
    for (var i = 0; i < 50; i++) {
        setTimeout(createSnowflake, i * 100);
    }
    snowIntervalId = window.setInterval(createSnowflake, 300);
}
// Initialize passenger state
var passengerState = {
    port: 'southampton', // Default to Southampton for background
    age: 30, // Default age from slider
    gender: null,
    ticketClass: null,
    travelWithFamily: false,
    familySize: null
};
// Track last rendered character to avoid unnecessary re-renders
var lastRenderedCharacter = null;
// Port background images
var PORT_BACKGROUNDS = {
    southampton: 'src/public/images/search/ports/southampton.png',
    cherbourg: 'src/public/images/search/ports/cherbourg.png',
    queenstown: 'src/public/images/search/ports/queenstown.png'
};
// DOM Elements
var searchPreview = document.getElementById('search-preview');
var previewBackground = document.getElementById('preview-background');
var previewCharacterLayer = document.getElementById('preview-character-layer');
var previewSeagulls = document.getElementById('preview-seagulls');
var previewSnow = document.getElementById('preview-snow');
var ageSlider = document.getElementById('age');
var ageValue = document.getElementById('age-value');
var familyCheckbox = document.getElementById('travelWithFamily');
var familySizeField = document.getElementById('family-size-field');
var calculateButton = document.getElementById('calculate-button');
var harborAudio = document.getElementById('harbor-audio');
var searchSnowIntervalId = null;
var searchBirdIntervalId = null;
/**
 * Age to bucket mapping (boundaries: 0-4, 4-14, 14-30, 30-50, 50+)
 * Rule: Lower bound inclusive, upper bound exclusive
 */
function getAgeBucket(age) {
    if (age < 4)
        return 'baby';
    if (age < 14)
        return 'child';
    if (age < 30)
        return 'youngAdult';
    if (age < 50)
        return 'adult';
    return 'senior';
}
/**
 * Convert age bucket to filename token
 */
function ageBucketToToken(bucket) {
    var tokenMap = {
        baby: 'b',
        child: 'c',
        youngAdult: 'ya',
        adult: 'a',
        senior: 's'
    };
    return tokenMap[bucket];
}
/**
 * Generate character filename based on passenger data
 */
function getCharacterAsset(passenger) {
    var genderToken = passenger.gender === 'male' ? 'm' : 'f';
    var ageBucket = getAgeBucket(passenger.age);
    var ageToken = ageBucketToToken(ageBucket);
    var classToken = passenger.ticketClass.toString();
    var filename = "".concat(genderToken, "_").concat(ageToken, "_").concat(classToken, ".png");
    return "src/public/images/search/characters/".concat(filename);
}
/**
 * Check if passenger profile is complete
 */
function isPassengerComplete(state) {
    return (state.port !== null &&
        state.age !== null &&
        state.gender !== null &&
        state.ticketClass !== null &&
        (!state.travelWithFamily || state.familySize !== null));
}
/**
 * Update preview background based on selected port
 */
function updatePreviewBackground() {
    if (!previewBackground)
        return;
    if (passengerState.port) {
        previewBackground.style.backgroundImage = "url('".concat(PORT_BACKGROUNDS[passengerState.port], "')");
        previewBackground.classList.add('search__preview-background--visible');
    }
    else {
        previewBackground.classList.remove('search__preview-background--visible');
    }
}
/**
 * Update character in preview
 * Only re-renders if character asset path has changed
 */
function updatePreviewCharacter() {
    if (!previewCharacterLayer)
        return;
    // Only show character if all required fields are filled
    if (isPassengerComplete(passengerState)) {
        var characterPath = getCharacterAsset({
            gender: passengerState.gender,
            age: passengerState.age,
            ticketClass: passengerState.ticketClass
        });
        // Only update if character has changed
        if (characterPath === lastRenderedCharacter) {
            return; // Character hasn't changed, skip re-render
        }
        lastRenderedCharacter = characterPath;
        // Clear existing character
        previewCharacterLayer.innerHTML = '';
        var character_1 = document.createElement('img');
        character_1.className = 'search__character';
        character_1.src = characterPath;
        character_1.alt = 'Your passenger character';
        // Handle missing image
        character_1.onerror = function () {
            character_1.src = 'src/public/images/search/characters/placeholder.png';
        };
        // Add to preview
        previewCharacterLayer.appendChild(character_1);
        // Trigger visible animation
        setTimeout(function () {
            character_1.classList.add('search__character--visible');
        }, 50);
    }
    else {
        // Clear character if profile incomplete
        if (lastRenderedCharacter !== null) {
            previewCharacterLayer.innerHTML = '';
            lastRenderedCharacter = null;
        }
    }
}
/**
 * Update calculate button state
 */
function updateButtonState() {
    if (calculateButton) {
        calculateButton.disabled = !isPassengerComplete(passengerState);
    }
}
/**
 * Update all preview elements
 */
function updatePreview() {
    updatePreviewBackground();
    updatePreviewCharacter();
    updateButtonState();
}
/**
 * Handle option button clicks (port, gender, class, family size)
 */
function handleOptionButtonClick(button) {
    var _a;
    var field = button.dataset.field;
    var value = button.dataset.value;
    if (!field || !value)
        return;
    // Remove active class from siblings
    var siblings = (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll("[data-field=\"".concat(field, "\"]"));
    siblings === null || siblings === void 0 ? void 0 : siblings.forEach(function (btn) { return btn.classList.remove('search__option-button--active', 'search__icon-button--active'); });
    // Add active class to clicked button
    if (button.classList.contains('search__icon-button')) {
        button.classList.add('search__icon-button--active');
    }
    else {
        button.classList.add('search__option-button--active');
    }
    // Update state
    switch (field) {
        case 'port':
            passengerState.port = value;
            break;
        case 'gender':
            passengerState.gender = value;
            break;
        case 'ticketClass':
            passengerState.ticketClass = parseInt(value);
            break;
        case 'familySize':
            passengerState.familySize = parseInt(value);
            break;
    }
    updatePreview();
}
/**
 * Handle age slider change
 */
function handleAgeChange() {
    if (!ageSlider || !ageValue)
        return;
    var age = parseInt(ageSlider.value, 10);
    passengerState.age = age;
    ageValue.textContent = age.toString();
    updatePreview();
}
/**
 * Handle family checkbox change
 */
function handleFamilyCheckboxChange() {
    if (!familyCheckbox || !familySizeField)
        return;
    passengerState.travelWithFamily = familyCheckbox.checked;
    if (familyCheckbox.checked) {
        familySizeField.style.display = 'flex';
    }
    else {
        familySizeField.style.display = 'none';
        passengerState.familySize = null;
        // Remove active state from family size buttons
        familySizeField.querySelectorAll('.search__option-button').forEach(function (btn) {
            btn.classList.remove('search__option-button--active');
        });
    }
    updatePreview();
}
/**
 * Initialize Search section
 */
function initSearchSection() {
    console.log('🚀 initSearchSection() called!');
    console.log('🎯 About to start snow and seagulls...');
    // Set default port (Southampton) as active
    var defaultPortButton = document.querySelector('[data-field="port"][data-value="southampton"]');
    if (defaultPortButton) {
        defaultPortButton.classList.add('search__option-button--active');
    }
    // Attach event listeners to all option buttons
    document.querySelectorAll('[data-field]').forEach(function (button) {
        button.addEventListener('click', function () { return handleOptionButtonClick(button); });
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
function startSearchSnowfall() {
    console.log('🌨️ Starting search snowfall...');
    console.log('previewBackground element:', previewBackground);
    if (!previewBackground) {
        console.error('❌ previewBackground is null!');
        return;
    }
    var createSnowflake = function () {
        var flake = document.createElement("div");
        flake.className = "snowflake";
        // Set inline styles for guaranteed positioning
        flake.style.cssText = "\n            position: absolute;\n            left: ".concat(Math.random() * 100, "%;\n            top: 0;\n            width: ").concat(4 + Math.random() * 3, "px;\n            height: ").concat(4 + Math.random() * 3, "px;\n            border-radius: 50%;\n            background-color: rgba(173, 216, 230, 0.8);\n            box-shadow: 0 0 3px rgba(173, 216, 230, 0.6);\n            pointer-events: none;\n            z-index: 10;\n        ");
        var duration = 8000 + Math.random() * 6000;
        var drift = (Math.random() - 0.5) * 100;
        flake.style.animationDuration = "".concat(duration, "ms");
        flake.style.setProperty('--start-y', '0vh');
        flake.style.setProperty('--drift', "".concat(drift, "px"));
        previewBackground.appendChild(flake);
        setTimeout(function () {
            if (previewBackground && flake.parentNode === previewBackground) {
                previewBackground.removeChild(flake);
            }
        }, duration + 100);
    };
    // Initial burst of snowflakes
    console.log('Creating initial 20 snowflakes...');
    for (var i = 0; i < 20; i++) {
        setTimeout(createSnowflake, i * 200);
    }
    // Continuous snowfall
    searchSnowIntervalId = window.setInterval(createSnowflake, 500);
    console.log('✅ Snow interval started');
}
/**
 * Create a seagull in search preview
 */
function createSearchSeagull() {
    if (!previewBackground)
        return;
    var bird = document.createElement("img");
    bird.src = birdFrames[0];
    bird.alt = "Seagull";
    bird.className = "search__seagull";
    var size = 8 + Math.random() * 4;
    var topPosition = 15 + Math.random() * 30;
    var duration = 12 + Math.random() * 8;
    bird.style.width = "".concat(size, "%");
    bird.style.top = "".concat(topPosition, "%");
    bird.style.left = '-15%';
    bird.style.position = 'absolute';
    bird.style.animationDuration = "".concat(duration, "s");
    previewBackground.appendChild(bird);
    // Animate sprite frames
    var frameIndex = 0;
    var spriteInterval = setInterval(function () {
        frameIndex = (frameIndex + 1) % birdFrames.length;
        bird.src = birdFrames[frameIndex];
    }, 100);
    // Remove after animation
    setTimeout(function () {
        clearInterval(spriteInterval);
        if (bird.parentNode === previewBackground) {
            previewBackground.removeChild(bird);
        }
    }, duration * 1000 + 500);
}
/**
 * Start generating seagulls in search preview
 */
function startSearchSeagulls() {
    createSearchSeagull();
    searchBirdIntervalId = window.setInterval(function () {
        createSearchSeagull();
    }, 10000 + Math.random() * 8000);
}
/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", function () {
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
        heroCta.addEventListener("click", function () {
            var searchSection = document.getElementById("search");
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
function crossfadeAudio(direction) {
    if (!heroAudio || !harborAudio)
        return;
    manualCrossfadeInProgress = true;
    var fadeDuration = 1500; // 1.5 seconds
    var steps = 30; // 30 steps = smooth transition
    var stepDuration = fadeDuration / steps;
    var currentStep = 0;
    var fadeInterval = setInterval(function () {
        currentStep++;
        var progress = currentStep / steps; // 0.0 to 1.0
        if (direction === 'hero-to-search') {
            // Fade out hero
            heroAudio.volume = Math.max(0, 0.8 * (1 - progress));
            // Fade in harbor
            if (harborAudio.paused && experienceStarted) {
                harborAudio.play().catch(function (err) { return console.log("Harbor audio play error:", err); });
            }
            harborAudio.volume = Math.min(0.8, 0.8 * progress);
            // Stop hero when fully faded
            if (currentStep >= steps) {
                heroAudio.pause();
                heroAudio.currentTime = 0;
                clearInterval(fadeInterval);
                manualCrossfadeInProgress = false;
            }
        }
        else {
            // Fade out harbor
            harborAudio.volume = Math.max(0, 0.8 * (1 - progress));
            // Fade in hero
            if (heroAudio.paused && experienceStarted) {
                heroAudio.currentTime = 0;
                heroAudio.play().catch(function (err) { return console.log("Hero audio play error:", err); });
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
function setupAudioTransitions() {
    if (!heroAudio || !harborAudio)
        return;
    // Set initial volumes
    heroAudio.volume = 0.8;
    harborAudio.volume = 0;
    var heroSection = document.querySelector('.hero');
    var searchSection = document.getElementById('search');
    if (!heroSection || !searchSection)
        return;
    // More threshold steps for smoother transitions (21 steps = every 5%)
    var options = {
        root: null,
        threshold: [0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0]
    };
    // Observer for Search section
    var searchObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            // Don't interfere if manual crossfade is in progress
            if (manualCrossfadeInProgress)
                return;
            var ratio = entry.intersectionRatio;
            if (ratio > 0.05) {
                // Search section becoming visible
                // Fade out hero audio smoothly (stops at 0.3 ratio)
                if (heroAudio && !heroAudio.paused) {
                    if (ratio > 0.3) {
                        // Stop hero completely after 30% search visible
                        heroAudio.pause();
                        heroAudio.currentTime = 0;
                    }
                    else {
                        // Smooth fade out from 5% to 30%
                        var fadeRatio = 1 - (ratio / 0.3); // 1.0 at 5%, 0.0 at 30%
                        heroAudio.volume = Math.max(0, 0.8 * fadeRatio);
                    }
                }
                // Start harbor audio and fade in smoothly
                if (harborAudio.paused && experienceStarted) {
                    harborAudio.play().catch(function (err) { return console.log("Harbor audio play error:", err); });
                }
                // Smooth fade in from 5% to 60%
                if (ratio <= 0.6) {
                    var fadeInRatio = ratio / 0.6; // 0.0 at 5%, 1.0 at 60%
                    harborAudio.volume = Math.min(0.8, fadeInRatio * 0.8);
                }
                else {
                    harborAudio.volume = 0.8;
                }
            }
            else {
                // Search section not visible - stop harbor audio
                harborAudio.volume = 0;
                if (!harborAudio.paused) {
                    harborAudio.pause();
                    harborAudio.currentTime = 0;
                }
                // Resume hero audio only if hero is visible and experience started
                if (experienceStarted && heroAudio.paused) {
                    var heroRect = heroSection.getBoundingClientRect();
                    var heroVisible = heroRect.top < window.innerHeight && heroRect.bottom > 0;
                    if (heroVisible) {
                        heroAudio.currentTime = 0; // Restart from beginning
                        heroAudio.volume = 0.8;
                        heroAudio.play().catch(function (err) { return console.log("Hero audio play error:", err); });
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
window.addEventListener("beforeunload", function () {
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
