/**
 * Passenger-related type definitions
 */

import { Port, Gender, AgeBucket } from './index';

export interface PassengerState {
    port: Port | null;
    gender: Gender | null;
    age: number | null;
    ticketClass: number | null;
    travelWithFamily: boolean;
    familySize: number | null;
}

export interface FamilyMember {
    gender: Gender;
    age: number;
    ageBucket: AgeBucket;
    ticketClass: number;
    position: number;
    zIndex: number;
    isMainCharacter: boolean;
}
