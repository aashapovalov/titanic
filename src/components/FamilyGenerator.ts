import { PassengerState, FamilyMember } from '../types/passenger';
import { Gender, AgeBucket } from '../types';
import { getAgeBucket, calculateZIndex, randomIntInRange } from '../utils/calculations';
import { FAMILY_POSITIONS } from '../config/constants';

export class FamilyGenerator {

    generate(passenger: PassengerState, familySize: number): FamilyMember[] {
        if (!passenger.age || !passenger.gender || !passenger.ticketClass) {
            throw new Error('Cannot generate family: missing passenger data');
        }

        const ageBucket = getAgeBucket(passenger.age);
        const positions = FAMILY_POSITIONS[familySize as keyof typeof FAMILY_POSITIONS];

        // Generate based on age bucket
        let family: FamilyMember[];
        
        switch (ageBucket) {
            case 'baby':
                family = this.generateBabyFamily(passenger, familySize, positions);
                break;
            case 'child':
                family = this.generateChildFamily(passenger, familySize, positions);
                break;
            case 'youngAdult':
                family = this.generateYoungAdultFamily(passenger, familySize, positions);
                break;
            case 'adult':
                family = this.generateAdultFamily(passenger, familySize, positions);
                break;
            case 'senior':
                family = this.generateSeniorFamily(passenger, familySize, positions);
                break;
        }

        console.log(`👨‍👩‍👧‍👦 Generated family of ${familySize}:`, family);
        return family;
    }

    private generateBabyFamily(passenger: PassengerState, size: number, positions: number[]): FamilyMember[] {
        const family: FamilyMember[] = [];

        // Main character (baby)
        family.push(this.createMainCharacter(passenger, positions[0]));

        // Mother
        if (size >= 2) {
            family.push(this.createFamilyMember('female', randomIntInRange(25, 35), passenger.ticketClass!, positions[1]));
        }

        // Father
        if (size >= 3) {
            family.push(this.createFamilyMember('male', randomIntInRange(27, 37), passenger.ticketClass!, positions[2]));
        }

        // Sibling
        if (size >= 4) {
            family.push(this.createFamilyMember(this.randomGender(), randomIntInRange(3, 8), passenger.ticketClass!, positions[3]));
        }

        return family;
    }

    private generateChildFamily(passenger: PassengerState, size: number, positions: number[]): FamilyMember[] {
        const family: FamilyMember[] = [];

        // Main character (child)
        family.push(this.createMainCharacter(passenger, positions[0]));

        // Mother
        if (size >= 2) {
            family.push(this.createFamilyMember('female', passenger.age! + randomIntInRange(25, 35), passenger.ticketClass!, positions[1]));
        }

        // Father
        if (size >= 3) {
            family.push(this.createFamilyMember('male', passenger.age! + randomIntInRange(27, 37), passenger.ticketClass!, positions[2]));
        }

        // Sibling
        if (size >= 4) {
            const siblingAge = Math.max(0, passenger.age! + randomIntInRange(-5, 5));
            family.push(this.createFamilyMember(this.randomGender(), siblingAge, passenger.ticketClass!, positions[3]));
        }

        return family;
    }

    private generateYoungAdultFamily(passenger: PassengerState, size: number, positions: number[]): FamilyMember[] {
        const family: FamilyMember[] = [];

        // Main character
        family.push(this.createMainCharacter(passenger, positions[0]));

        const hasSpouse = Math.random() > 0.7; // 30% chance of spouse

        if (hasSpouse && size >= 2) {
            // Spouse
            const oppositeGender = passenger.gender === 'male' ? 'female' : 'male';
            family.push(this.createFamilyMember(oppositeGender, passenger.age! + randomIntInRange(-3, 3), passenger.ticketClass!, positions[1]));

            // Child
            if (size >= 3) {
                family.push(this.createFamilyMember(this.randomGender(), randomIntInRange(0, 5), passenger.ticketClass!, positions[2]));
            }
        } else {
            // Parent
            if (size >= 2) {
                family.push(this.createFamilyMember('female', passenger.age! + randomIntInRange(25, 35), passenger.ticketClass!, positions[1]));
            }

            // Sibling or other parent
            if (size >= 3) {
                family.push(this.createFamilyMember(this.randomGender(), passenger.age! + randomIntInRange(-8, 8), passenger.ticketClass!, positions[2]));
            }
        }

        // Additional sibling
        if (size >= 4) {
            family.push(this.createFamilyMember(this.randomGender(), passenger.age! + randomIntInRange(-10, 10), passenger.ticketClass!, positions[3]));
        }

        return family;
    }

    private generateAdultFamily(passenger: PassengerState, size: number, positions: number[]): FamilyMember[] {
        const family: FamilyMember[] = [];

        // Main character
        family.push(this.createMainCharacter(passenger, positions[0]));

        // Spouse
        if (size >= 2) {
            const oppositeGender = passenger.gender === 'male' ? 'female' : 'male';
            family.push(this.createFamilyMember(oppositeGender, passenger.age! + randomIntInRange(-5, 5), passenger.ticketClass!, positions[1]));
        }

        // Children
        if (size >= 3) {
            const childAge = Math.max(0, passenger.age! - randomIntInRange(20, 30));
            family.push(this.createFamilyMember(this.randomGender(), childAge, passenger.ticketClass!, positions[2]));
        }

        if (size >= 4) {
            const childAge = Math.max(0, passenger.age! - randomIntInRange(15, 25));
            family.push(this.createFamilyMember(this.randomGender(), childAge, passenger.ticketClass!, positions[3]));
        }

        return family;
    }

    private generateSeniorFamily(passenger: PassengerState, size: number, positions: number[]): FamilyMember[] {
        const family: FamilyMember[] = [];

        // Main character
        family.push(this.createMainCharacter(passenger, positions[0]));

        // Spouse
        if (size >= 2) {
            const oppositeGender = passenger.gender === 'male' ? 'female' : 'male';
            family.push(this.createFamilyMember(oppositeGender, passenger.age! + randomIntInRange(-5, 5), passenger.ticketClass!, positions[1]));
        }

        // Adult children
        if (size >= 3) {
            const childAge = passenger.age! - randomIntInRange(25, 35);
            family.push(this.createFamilyMember(this.randomGender(), childAge, passenger.ticketClass!, positions[2]));
        }

        if (size >= 4) {
            const childAge = passenger.age! - randomIntInRange(30, 40);
            family.push(this.createFamilyMember(this.randomGender(), childAge, passenger.ticketClass!, positions[3]));
        }

        return family;
    }

    private createMainCharacter(passenger: PassengerState, position: number): FamilyMember {
        return {
            gender: passenger.gender!,
            age: passenger.age!,
            ageBucket: getAgeBucket(passenger.age!),
            ticketClass: passenger.ticketClass!,
            position,
            zIndex: calculateZIndex(position),
            isMainCharacter: true
        };
    }

    private createFamilyMember(gender: Gender, age: number, ticketClass: number, position: number): FamilyMember {
        return {
            gender,
            age,
            ageBucket: getAgeBucket(age),
            ticketClass,
            position,
            zIndex: calculateZIndex(position),
            isMainCharacter: false
        };
    }

    private randomGender(): Gender {
        return Math.random() > 0.5 ? 'male' : 'female';
    }
}
