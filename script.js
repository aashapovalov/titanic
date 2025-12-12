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
    port: null,
    age: 30, // Default age from slider
    gender: null,
    ticketClass: null,
    travelWithFamily: false,
    familySize: null
};
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
var ageSlider = document.getElementById('age');
var ageValue = document.getElementById('age-value');
var familyCheckbox = document.getElementById('travelWithFamily');
var familySizeField = document.getElementById('family-size-field');
var calculateButton = document.getElementById('calculate-button');
var harborAudio = document.getElementById('harbor-audio');
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
 */
function updatePreviewCharacter() {
    if (!previewCharacterLayer)
        return;
    // Clear existing character
    previewCharacterLayer.innerHTML = '';
    // Only show character if all required fields are filled
    if (isPassengerComplete(passengerState)) {
        var characterPath = getCharacterAsset({
            gender: passengerState.gender,
            age: passengerState.age,
            ticketClass: passengerState.ticketClass
        });
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
    // Initial preview update (will show empty state)
    updatePreview();
}
/**
 * Initialize on page load
 */
document.addEventListener("DOMContentLoaded", function () {
    // Generate waves for Hero
    generateRandomWaves();
    // Wait for user to click start button
    if (startButton) {
        startButton.addEventListener("click", startExperience);
    }
    // Initialize Search section
    initSearchSection();
    // Scroll Hero CTA to Search
    if (heroCta) {
        heroCta.addEventListener("click", function () {
            var searchSection = document.getElementById("search");
            if (searchSection) {
                searchSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    }
});
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
    if (heroAudio) {
        heroAudio.pause();
    }
    if (harborAudio) {
        harborAudio.pause();
    }
});
