import {AgeBucket, FamilyScenarioRule} from "../types";

export const BABY_FAMILY_RULES: FamilyScenarioRule[] = [
    {
        familySize: 2,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'random',
                uniqueness: 'strict',
            },
        ],
    },
    {
        familySize: 3,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
        ],
    },
    {
        familySize: 4,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'sibling',
                ageGroup: 'child',
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.5,
            },
        ],
    },
];

export const CHILD_FAMILY_RULES: FamilyScenarioRule[] = [
    {
        familySize: 2,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'random',
                uniqueness: 'strict',
            },
        ],
    },
    {
        familySize: 3,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
        ],
    },
    {
        familySize: 4,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'sibling',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.5,
            },
        ],
    },
];

export const YOUNG_ADULT_RULES: FamilyScenarioRule[] = [
    // Size 2: + Spouse (youngAdult, opposite gender) OR Parent (50% chance each)
    // We'll model it as two explicit variants; generator will choose between them (later).
    {
        familySize: 2,
        members: [
            {
                role: 'spouse',
                ageGroup: 'youngAdult',
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
        ],
    },
    {
        familySize: 2,
        members: [
            {
                role: 'parent',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'random',
                uniqueness: 'strict',
            },
        ],
    },

    // Size 3: + Spouse + Child (child/baby, random gender)
    {
        familySize: 3,
        members: [
            {
                role: 'spouse',
                ageGroup: 'youngAdult',
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.2,
            },
        ],
    },

    // Size 4: + Spouse + Child + Child (random genders)
    {
        familySize: 4,
        members: [
            {
                role: 'spouse',
                ageGroup: 'youngAdult',
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.2,
            },
            {
                role: 'child',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                // for two kids, we'd prefer not identical; keep strict uniqueness
                uniqueness: 'strict',
            },
        ],
    },
];

// --------------------
// Adult (30–49)
// --------------------

export const ADULT_RULES: FamilyScenarioRule[] = [
    // Size 2: + Spouse (adult/youngAdult, opposite gender)
    {
        familySize: 2,
        members: [
            {
                role: 'spouse',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
        ],
    },

    // Size 3: + Spouse + Child (child/baby, random gender)
    {
        familySize: 3,
        members: [
            {
                role: 'spouse',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.2,
            },
        ],
    },

    // Size 4: + Spouse + Child + Child (different ages, random genders)
    {
        familySize: 4,
        members: [
            {
                role: 'spouse',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: 'child', // one child as child
                gender: 'random',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: 'baby', // the second as baby to ensure different ages
                gender: 'random',
                uniqueness: 'strict',
            },
        ],
    },
];

// --------------------
// Senior (50+)
// --------------------

export const SENIOR_RULES: FamilyScenarioRule[] = [
    // Size 2: + Spouse (senior/adult, opposite gender)
    {
        familySize: 2,
        members: [
            {
                role: 'spouse',
                ageGroup: ['senior', 'adult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
        ],
    },

    // Size 3: + Spouse + Adult child (adult/youngAdult, random gender)
    {
        familySize: 3,
        members: [
            {
                role: 'spouse',
                ageGroup: ['senior', 'adult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'random',
                uniqueness: 'strict',
            },
        ],
    },

    // Size 4: + Spouse + Adult child + Grandchild (child/baby, random gender)
    {
        familySize: 4,
        members: [
            {
                role: 'spouse',
                ageGroup: ['senior', 'adult'],
                gender: 'oppositeToMain',
                uniqueness: 'strict',
            },
            {
                role: 'child',
                ageGroup: ['adult', 'youngAdult'],
                gender: 'random',
                uniqueness: 'strict',
            },
            {
                role: 'grandchild',
                ageGroup: ['child', 'baby'],
                gender: 'random',
                uniqueness: 'allowDuplicateChance',
                duplicateChance: 0.2,
            },
        ],
    },
];

// --------------------
// Combined registry
// --------------------

export const FAMILY_RULES: Record<AgeBucket, FamilyScenarioRule[]> = {
    baby: BABY_FAMILY_RULES,
    child: CHILD_FAMILY_RULES,
    youngAdult: YOUNG_ADULT_RULES,
    adult: ADULT_RULES,
    senior: SENIOR_RULES,
};

