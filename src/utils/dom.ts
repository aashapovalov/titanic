export function getElementById<T extends HTMLElement = HTMLElement>(id: string): T | null {
    return document.getElementById(id) as T | null;
}

export function querySelector<T extends HTMLElement = HTMLElement>(selector: string): T | null {
    return document.querySelector(selector) as T | null;
}

export function querySelectorAll<T extends HTMLElement = HTMLElement>(selector: string): NodeListOf<T> {
    return document.querySelectorAll(selector) as NodeListOf<T>;
}

export function addClass(element: HTMLElement | null, className: string): void {
    element?.classList.add(className);
}

export function removeClass(element: HTMLElement | null, className: string): void {
    element?.classList.remove(className);
}

export function toggleClass(element: HTMLElement | null, className: string): void {
    element?.classList.toggle(className);
}

export function hasClass(element: HTMLElement | null, className: string): boolean {
    return element?.classList.contains(className) || false;
}

export function setAttributes(element: HTMLElement, attributes: Record<string, string>): void {
    Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
    });
}

export function scrollToElement(
    element: HTMLElement | string,
    block: ScrollLogicalPosition = 'start'
): void {
    const target = typeof element === 'string' ? querySelector(element) : element;
    
    target?.scrollIntoView({
        behavior: 'smooth',
        block
    });
}

export function waitForElement<T extends HTMLElement = HTMLElement>(
    selector: string,
    timeout: number = 5000
): Promise<T> {
    return new Promise((resolve, reject) => {
        const element = querySelector<T>(selector);
        
        if (element) {
            resolve(element);
            return;
        }

        const observer = new MutationObserver(() => {
            const element = querySelector<T>(selector);
            if (element) {
                observer.disconnect();
                resolve(element);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            reject(new Error(`Element not found: ${selector}`));
        }, timeout);
    });
}
