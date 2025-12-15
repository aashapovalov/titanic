
// Age bucket definitions
export const AGE_BUCKETS = {
    baby: { min: 0, max: 2 },
    child: { min: 3, max: 12 },
    youngAdult: { min: 13, max: 25 },
    adult: { min: 26, max: 59 },
    senior: { min: 60, max: 100 }
};

// API endpoint
export const API_ENDPOINT = 'http://localhost:5001/predict';

// Family positioning by size
export const FAMILY_POSITIONS = {
    2: [35, 65],
    3: [20, 50, 80],
    4: [15, 35, 65, 85]
};
