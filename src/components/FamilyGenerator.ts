import { PassengerState, FamilyMember } from '../types/passenger';
import {Gender, AgeBucket, FamilyMemberRule} from '../types';
import { getAgeBucket, calculateZIndex, randomIntInRange } from '../utils/calculations';
import {AGE_BUCKETS, FAMILY_POSITIONS} from '../config/constants';
import {FAMILY_RULES} from "../config/familyRules";


export class FamilyGenerator {

    // FamilyGenerator.ts (ключевые части)

    generate(passenger: PassengerState, familySize: number): FamilyMember[] {
        if (!passenger.age || !passenger.gender || !passenger.ticketClass) {
            console.warn('Cannot generate family: missing passenger data', passenger);
            return [];
        }

        const ageBucket = getAgeBucket(passenger.age);
        const positions = FAMILY_POSITIONS[familySize as keyof typeof FAMILY_POSITIONS];

        // main always first
        const family: FamilyMember[] = [this.createMainCharacter(passenger, positions[0])];

        // if familySize is 1/undefined – just main (на всякий)
        if (!positions || familySize < 2) return family;

        const scenarios = (FAMILY_RULES[ageBucket] || []).filter(s => s.familySize === familySize);
        if (!scenarios.length) return family;

        const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

        // uniqueness tracking
        const used = new Set<string>();
        used.add(this.signatureFromMember(family[0]));

        // special-case: two parents => force opposite genders
        const parentRulesIdx = scenario.members
            .map((m, idx) => ({ m, idx }))
            .filter(x => x.m.role === 'parent')
            .map(x => x.idx);

        let forcedParentGenders: ('female' | 'male')[] | null = null;
        if (parentRulesIdx.length >= 2) {
            forcedParentGenders = ['female', 'male'];
        }

        let forcedParentCursor = 0;

        // generate members described in rules
        scenario.members.forEach((rule, i) => {
            const pos = positions[i + 1]; // because positions[0] is main

            const member = this.createMemberByRule(rule, passenger, used, () => {
                if (!forcedParentGenders) return null;
                if (rule.role !== 'parent') return null;
                const g = forcedParentGenders[forcedParentCursor % forcedParentGenders.length];
                forcedParentCursor += 1;
                return g;
            });

            family.push({
                ...member,
                position: pos,
                zIndex: calculateZIndex(pos),
                isMainCharacter: false,
            });
        });

        return family;
    }

    private createMemberByRule(
        rule: FamilyMemberRule,
        main: PassengerState,
        used: Set<string>,
        getForcedGender: () => Gender | null
    ): Omit<FamilyMember, 'position' | 'zIndex' | 'isMainCharacter'> {
        const ticketClass = main.ticketClass!;

        // resolve candidate genders / buckets
        const forced = getForcedGender();
        const gender = forced ?? this.resolveGender(rule.gender, main.gender!);
        const bucket = this.resolveAgeBucket(rule.ageGroup);
        const age = this.randomAgeInBucket(bucket);

        const candidate = {
            gender,
            ageBucket: bucket,
            age,
            ticketClass,
        };

        const uniqueness = rule.uniqueness ?? 'strict';
        const allowDup =
            uniqueness === 'allowDuplicateChance' && Math.random() < (rule.duplicateChance ?? 0);

        if (allowDup) return candidate;

        // strict uniqueness with retries
        const maxTries = 20;
        for (let t = 0; t < maxTries; t++) {
            const sig = this.signatureFromParts(candidate.gender, candidate.ageBucket, ticketClass);
            if (!used.has(sig)) {
                used.add(sig);
                return candidate;
            }

            // reroll (gender may be fixed by rule)
            const g2 = forced ?? (rule.gender === 'random' ? this.randomGender() : gender);
            const b2 = this.resolveAgeBucket(rule.ageGroup);
            candidate.gender = g2;
            candidate.ageBucket = b2;
            candidate.age = this.randomAgeInBucket(b2);
        }

        // fallback: return even if duplicate (лучше показать семью, чем сломать UI)
        return candidate;
    }

    private resolveGender(rule: 'sameAsMain' | 'oppositeToMain' | 'random', mainGender: Gender): Gender {
        if (rule === 'sameAsMain') return mainGender;
        if (rule === 'oppositeToMain') return mainGender === 'male' ? 'female' : 'male';
        return this.randomGender();
    }

    private resolveAgeBucket(ageGroup: AgeBucket | AgeBucket[]): AgeBucket {
        if (Array.isArray(ageGroup)) {
            return ageGroup[Math.floor(Math.random() * ageGroup.length)];
        }
        return ageGroup;
    }

    private randomAgeInBucket(bucket: AgeBucket): number {
        const range = AGE_BUCKETS[bucket];
        return randomIntInRange(range.min, range.max);
    }

    private signatureFromMember(m: FamilyMember): string {
        return this.signatureFromParts(m.gender, m.ageBucket, m.ticketClass);
    }

    private signatureFromParts(g: Gender, b: AgeBucket, c: number): string {
        return `${g}_${b}_${c}`;
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
