import { AgeBucket } from '../types';
import {AGE_BUCKETS} from "../config/constants";

export function  getAgeBucket(age: number): AgeBucket {
    if (age >= AGE_BUCKETS.baby.min && age < AGE_BUCKETS.baby.max) {
        return 'baby';
    }
    if (age >= AGE_BUCKETS.child.min && age < AGE_BUCKETS.child.max) {
        return 'child';
    }
    if (age >= AGE_BUCKETS.youngAdult.min && age < AGE_BUCKETS.youngAdult.max) {
        return 'youngAdult';
    }
    if (age >= AGE_BUCKETS.adult.min && age < AGE_BUCKETS.adult.max) {
        return 'adult';
    }
    return 'senior';
}

export function ageBucketToToken(bucket: AgeBucket): 'b' | 'c' | 'ya' | 'a' | 's' {
    const tokenMap: Record<AgeBucket, 'b' | 'c' | 'ya' | 'a' | 's'> = {
        baby: 'b',
        child: 'c',
        youngAdult: 'ya',
        adult: 'a',
        senior: 's',
    };
    return tokenMap[bucket];
}

export function calculateZIndex(position: number): number {
    // Distance from center (50%)
    const distanceFromCenter = Math.abs(50 - position);
    
    // Closer to center = higher z-index
    // Range: 100 (at center) to 50 (at edges)
    return Math.floor(100 - distanceFromCenter);
}

export function randomInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

export function randomIntInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}
