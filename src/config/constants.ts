
// Age bucket definitions
export const AGE_BUCKETS = {
    baby: { min: 0, max: 5 },
    child: { min: 5, max: 14 },
    youngAdult: { min: 14, max: 30 },
    adult: { min: 30, max: 50 },
    senior: { min: 50, max: 80 }
};

// API endpoint
export const API_ENDPOINT = 'http://localhost:5001/predict';

// Family positioning by size
export const FAMILY_POSITIONS = {
    2: [35, 65],
    3: [20, 50, 80],
    4: [15, 35, 65, 85]
};
