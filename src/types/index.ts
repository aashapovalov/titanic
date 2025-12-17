export type Port = 'southampton' | 'cherbourg' | 'queenstown';
export type Gender = 'male' | 'female';
export type AgeBucket = 'baby' | 'child' | 'youngAdult' | 'adult' | 'senior';
export type FamilyRole = 'parent' | 'spouse' | 'child' | 'sibling' | 'grandchild';
export type GenderRule = 'sameAsMain' | 'oppositeToMain' | 'random';

export type UniquenessRule =
    | 'strict'
    | 'allowDuplicateChance';

export type FamilyMemberRule = {
    role: FamilyRole;
    ageGroup: AgeBucket | AgeBucket[];
    gender: GenderRule;
    uniqueness?: UniquenessRule;
    duplicateChance?: number; // 0..1
};

export type FamilyScenarioRule = {
    familySize: 2 | 3 | 4;
    members: FamilyMemberRule[];
};
