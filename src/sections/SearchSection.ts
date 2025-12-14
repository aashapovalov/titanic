import { effectManager } from '../core/EffectManager';
import { audioManager } from '../core/AudioManager';
import { stateManager } from '../core/StateManager';
import { FamilyGenerator } from '../components/FamilyGenerator';
import { CharacterPreview } from '../components/CharacterPreview';
import { SEAGULL_IMAGES, AUDIO } from '../config/assets';
import { PORT_BACKGROUNDS } from '../config/constants';
import { getElementById, querySelector, querySelectorAll } from '../utils/dom';

export class SearchSection {
    private snowEffectId: string | null = null;
    private birdsEffectId: string | null = null;
    private familyGenerator: FamilyGenerator;
    private characterPreview: CharacterPreview;
    private calculateButton: HTMLButtonElement | null = null;

    constructor() {
        this.familyGenerator = new FamilyGenerator();
        this.characterPreview = new CharacterPreview('#preview-character-layer');
    }

    initialize(): void {
        console.log('🔍 Initializing Search Section');

        this.setupEffects();
        this.setupEventListeners();
    }

    private setupEffects(): void {
        // Snow effect
        this.snowEffectId = effectManager.start('snow', {
            container: '#preview-snow',
            density: 'medium',
            speed: 'medium',
            interval: 200
        }, 'search-snow');

        // Seagull effect
        this.birdsEffectId = effectManager.start('birds', {
            container: '#preview-seagulls',
            frames: SEAGULL_IMAGES,
            interval: 15000
        }, 'search-seagulls');
    }

    private setupEventListeners(): void {
        // Port buttons
        querySelectorAll('[data-field="port"]').forEach(button => {
            button.addEventListener('click', (e) => this.handlePortClick(e));
        });

        // Gender buttons
        querySelectorAll('[data-field="gender"]').forEach(button => {
            button.addEventListener('click', (e) => this.handleGenderClick(e));
        });

        // Age slider
        const ageSlider = getElementById<HTMLInputElement>('age');
        if (ageSlider) {
            ageSlider.addEventListener('input', () => this.handleAgeChange(ageSlider));
        }

        // Class buttons
        querySelectorAll('[data-field="ticketClass"]').forEach(button => {
            button.addEventListener('click', (e) => this.handleClassClick(e));
        });

        // Family checkbox
        const familyCheckbox = getElementById<HTMLInputElement>('travelWithFamily');
        if (familyCheckbox) {
            familyCheckbox.addEventListener('change', () => this.handleFamilyToggle(familyCheckbox));
        }

        // Family size buttons
        querySelectorAll('[data-field="familySize"]').forEach(button => {
            button.addEventListener('click', (e) => this.handleFamilySizeClick(e));
        });

        // Calculate button
        this.calculateButton = getElementById<HTMLButtonElement>('calculate-button');
        if (this.calculateButton) {
            this.calculateButton.addEventListener('click', () => this.handleCalculateClick());
        }
    }

    private handlePortClick(e: Event): void {
        const button = e.currentTarget as HTMLElement;
        const port = button.dataset.value;
        
        // Update state
        stateManager.setField('port', port as any);

        // Update UI
        this.updateButtonGroup('[data-field="port"]', button);
        this.updatePreviewBackground(port!);
        this.updatePreview();
        this.updateCalculateButton();
    }

    private handleGenderClick(e: Event): void {
        const button = e.currentTarget as HTMLElement;
        const gender = button.dataset.value;
        
        stateManager.setField('gender', gender as any);
        this.updateButtonGroup('[data-field="gender"]', button);
        this.updatePreview();
        this.updateCalculateButton();
    }

    private handleAgeChange(slider: HTMLInputElement): void {
        const age = parseInt(slider.value);
        stateManager.setField('age', age);
        
        // Update display
        const ageValue = getElementById('age-value');
        if (ageValue) {
            ageValue.textContent = String(age);
        }
        
        this.updatePreview();
        this.updateCalculateButton();
    }

    private handleClassClick(e: Event): void {
        const button = e.currentTarget as HTMLElement;
        const ticketClass = parseInt(button.dataset.value!);
        
        stateManager.setField('ticketClass', ticketClass);
        this.updateButtonGroup('[data-field="ticketClass"]', button);
        this.updatePreview();
        this.updateCalculateButton();
    }

    private handleFamilyToggle(checkbox: HTMLInputElement): void {
        const travelWithFamily = checkbox.checked;
        stateManager.setField('travelWithFamily', travelWithFamily);
        
        // Show/hide family size field
        const familySizeField = getElementById('family-size-field');
        if (familySizeField) {
            familySizeField.style.display = travelWithFamily ? 'block' : 'none';
        }
        
        // Reset family size if unchecked
        if (!travelWithFamily) {
            stateManager.setField('familySize', null);
            this.updatePreview();
        }
        
        this.updateCalculateButton();
    }

    private handleFamilySizeClick(e: Event): void {
        const button = e.currentTarget as HTMLElement;
        const familySize = parseInt(button.dataset.value!);
        
        stateManager.setField('familySize', familySize);
        this.updateButtonGroup('[data-field="familySize"]', button);
        this.updatePreviewWithFamily();
        this.updateCalculateButton();
    }

    private updatePreviewBackground(port: string): void {
        const background = getElementById('preview-background');
        if (background && PORT_BACKGROUNDS[port as keyof typeof PORT_BACKGROUNDS]) {
            background.style.backgroundImage = `url('${PORT_BACKGROUNDS[port as keyof typeof PORT_BACKGROUNDS]}')`;
        }
    }

    private updatePreview(): void {
        const state = stateManager.getState();
        this.characterPreview.update(state);
    }

    private updatePreviewWithFamily(): void {
        const state = stateManager.getState();
        
        if (state.travelWithFamily && state.familySize) {
            try {
                const family = this.familyGenerator.generate(state, state.familySize);
                this.characterPreview.update(state, family);
            } catch (error) {
                console.error('Failed to generate family:', error);
                this.characterPreview.update(state);
            }
        } else {
            this.characterPreview.update(state);
        }
    }

    private updateButtonGroup(selector: string, activeButton: HTMLElement): void {
        querySelectorAll(selector).forEach(btn => {
            btn.classList.remove('search__option-button--active', 'search__icon-button--active');
        });
        
        activeButton.classList.add(
            activeButton.classList.contains('search__icon-button') 
                ? 'search__icon-button--active' 
                : 'search__option-button--active'
        );
    }

    private updateCalculateButton(): void {
        if (this.calculateButton) {
            const isComplete = stateManager.isComplete();
            this.calculateButton.disabled = !isComplete;
        }
    }

    private handleCalculateClick(): void {
        if (stateManager.isComplete()) {
            console.log('🧮 Calculate button clicked - navigating to results');
            
            // Dispatch custom event for main.ts to handle
            document.dispatchEvent(new CustomEvent('navigate-to-results'));
        }
    }

    cleanup(): void {
        console.log('🧹 Cleaning up Search Section');

        if (this.snowEffectId) effectManager.stop(this.snowEffectId);
        if (this.birdsEffectId) effectManager.stop(this.birdsEffectId);
        
        audioManager.stop(AUDIO.search);
    }
}
