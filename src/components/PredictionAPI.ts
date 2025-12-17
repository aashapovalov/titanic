import { PassengerState } from '../types/passenger';
import { API_ENDPOINT } from '../config/constants';

export class PredictionAPI {

    async predict(state: PassengerState): Promise<number> {
        if (!this.isStateComplete(state)) {
            throw new Error('Cannot predict: passenger state incomplete');
        }

        const payload = this.formatPayload(state);
        
        console.log('📡 Sending prediction request:', payload);

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (typeof data.survival_probability !== 'number') {
                throw new Error('Invalid API response: missing survival_probability');
            }

            const probability = data.survival_probability;
            console.log(`✅ Prediction received: ${(probability * 100).toFixed(1)}%`);
            
            return probability;

        } catch (error) {
            console.error('❌ Prediction API error:', error);
            throw error;
        }
    }

    private formatPayload(state: PassengerState): {
        Pclass: number;
        gender_code: number;
        Age: number;
        embarked_code: number;
        family_size: number;
    } {
        return {
            Pclass: state.ticketClass!,
            gender_code: state.gender === 'female' ? 1 : 2,
            Age: state.age!,
            embarked_code: this.getEmbarkedCode(state.port!),
            family_size: state.travelWithFamily ? (state.familySize || 1) : 1
        };
    }

    private getEmbarkedCode(port: string): number {
        const codes: Record<string, number> = {
            'southampton': 1,
            'cherbourg': 2,
            'queenstown': 3
        };
        return codes[port] || 1;
    }

    private isStateComplete(state: PassengerState): boolean {
        return (
            state.port !== null &&
            state.gender !== null &&
            state.age !== null &&
            state.ticketClass !== null &&
            (!state.travelWithFamily || state.familySize !== null)
        );
    }
}
