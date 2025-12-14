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
                ageBucket: this.getAgeBucket(state.age!),
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
        img.className = 'search__preview-character';
        
        // Position
        img.style.left = `${member.position}%`;
        img.style.transform = 'translateX(-50%)';
        
        // Z-index for depth
        img.style.zIndex = String(member.zIndex);
        
        // Scale main character slightly larger
        if (member.isMainCharacter) {
            img.style.transform = 'translateX(-50%) scale(1.1)';
            img.classList.add('search__preview-character--main');
        }

        this.container.appendChild(img);
    }

    private getCharacterImagePath(member: FamilyMember): string {
        // Get port from background or default to southampton
        const port = this.getCurrentPort();
        const { gender, ageBucket, ticketClass } = member;
        
        return `src/public/images/search/characters/${port}_${gender}_${ageBucket}_${ticketClass}.png`;
    }

    private getCurrentPort(): string {
        const bgElement = querySelector('#preview-background');
        if (bgElement) {
            const bgImage = window.getComputedStyle(bgElement).backgroundImage;
            if (bgImage.includes('southampton')) return 'southampton';
            if (bgImage.includes('cherbourg')) return 'cherbourg';
            if (bgImage.includes('queenstown')) return 'queenstown';
        }
        return 'southampton'; // Default
    }

    private getAgeBucket(age: number): AgeBucket {
        if (age <= 2) return 'baby';
        if (age <= 12) return 'child';
        if (age <= 25) return 'youngAdult';
        if (age <= 59) return 'adult';
        return 'senior';
    }

    private canRenderMainCharacter(state: PassengerState): boolean {
        return (
            state.gender !== null &&
            state.age !== null &&
            state.ticketClass !== null
        );
    }
}
