import { ageBucketToToken, getAgeBucket } from '../utils/calculations';
import { PassengerState, FamilyMember } from '../types/passenger';
import { querySelector } from '../utils/dom';
import { AgeBucket } from '../types';

export class CharacterPreview {
    private container: HTMLElement;

    constructor(containerSelector: string) {
        const element = querySelector(containerSelector);
        if (!element) {
            throw new Error(`Character preview container not found: ${containerSelector}`);
        }
        this.container = element;
    }

    update(state: PassengerState, family?: FamilyMember[]): void {
        this.clear();

        if (family && family.length > 0) {
            // Render all family members
            family.forEach(member => this.renderCharacter(member));
        } else if (this.canRenderMainCharacter(state)) {
            // Render just main character
            const mainCharacter: FamilyMember = {
                gender: state.gender!,
                age: state.age!,
                ageBucket: getAgeBucket(state.age!),
                ticketClass: state.ticketClass!,
                position: 50, // Center
                zIndex: 100,
                isMainCharacter: true
            };
            this.renderCharacter(mainCharacter);
        }
    }

    clear(): void {
        this.container.innerHTML = '';
    }

    private renderCharacter(member: FamilyMember): void {
        const img = document.createElement('img');
        img.src = this.getCharacterImagePath(member);
        img.alt = `${member.gender} ${member.ageBucket}`;
        img.className = 'search__character';
        
        // Position
        img.style.position = 'absolute';
        img.style.left = `${member.position}%`;
        img.style.bottom = '0';
        img.style.transform = 'translateX(-50%)';
        img.style.zIndex = String(member.zIndex);
        setTimeout(() => img.classList.add('search__character--visible'), 50);


        // Scale main character slightly larger
        if (member.isMainCharacter) {
            img.style.transform = 'translateX(-50%)';
            img.classList.add('search__preview-character--main');
        }

        this.container.appendChild(img);
    }

    private getCharacterImagePath(member: FamilyMember): string {
            const genderToken = member.gender === 'male' ? 'm' : 'f';
            const bucket = getAgeBucket(member.age);
            const ageToken = ageBucketToToken(bucket);
            const filename = `${genderToken}_${ageToken}_${member.ticketClass}.png`;
            return `images/search/characters/${filename}`;
    }

    private canRenderMainCharacter(state: PassengerState): boolean {
        return (
            state.gender !== null &&
            state.age !== null &&
            state.ticketClass !== null
        );
    }
}
