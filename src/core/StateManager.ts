import { PassengerState } from '../types/passenger';

export class StateManager {
    private static instance: StateManager;
    private state: PassengerState;

    private constructor() {
        this.state = this.createInitialState();
        console.log('📊 StateManager initialized');
    }

    static getInstance(): StateManager {
        if (!StateManager.instance) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    getState(): PassengerState {
        return { ...this.state };
    }

    setState(partial: Partial<PassengerState>): void {
        this.state = {
            ...this.state,
            ...partial
        };
        
        console.log('📝 State updated:', partial);
    }

    resetState(): void {
        this.state = this.createInitialState();
        console.log('🔄 State reset to initial values');
    }

    isComplete(): boolean {
        return (
            this.state.port !== null &&
            this.state.gender !== null &&
            this.state.age !== null &&
            this.state.ticketClass !== null &&
            (!this.state.travelWithFamily || this.state.familySize !== null)
        );
    }

    isMainCharacterReady(): boolean {
        return (
            this.state.port !== null &&
            this.state.gender !== null &&
            this.state.age !== null &&
            this.state.ticketClass !== null
        );
    }

    getField<K extends keyof PassengerState>(field: K): PassengerState[K] {
        return this.state[field];
    }

    setField<K extends keyof PassengerState>(field: K, value: PassengerState[K]): void {
        this.state[field] = value;
        console.log(`📝 Field updated: ${field} = ${value}`);
    }

    private createInitialState(): PassengerState {
        return {
            port: null,
            gender: null,
            age: null,
            ticketClass: null,
            travelWithFamily: false,
            familySize: null
        };
    }

    getAPIPayload(): {
        Pclass: number;
        gender_code: number;
        Age: number;
        embarked_code: number;
        family_size: number;
    } | null {
        if (!this.isComplete()) {
            console.error('Cannot create API payload: state incomplete');
            return null;
        }

        const embarkedMap = {
            'southampton': 1,
            'cherbourg': 2,
            'queenstown': 3
        };

        const genderMap = {
            'male': 0,
            'female': 1
        };

        return {
            Pclass: this.state.ticketClass!,
            gender_code: genderMap[this.state.gender!],
            Age: this.state.age!,
            embarked_code: embarkedMap[this.state.port!],
            family_size: this.state.travelWithFamily ? (this.state.familySize || 1) : 1
        };
    }

    logState(): void {
        console.log('Current State:', this.state);
        console.log('Is Complete:', this.isComplete());
        console.log('Is Main Character Ready:', this.isMainCharacterReady());
    }
}

export const stateManager = StateManager.getInstance();
