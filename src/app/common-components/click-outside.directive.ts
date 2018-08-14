import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[click-outside]'
})
export class ClickOutsideDirective {
    public isActive: boolean = false;

    @Output() public onClickOutside: EventEmitter<any> = new EventEmitter<any>();

    constructor(public elementRef: ElementRef) {

    }

    @HostListener('document:click', ['$event', '$event.target'])
    public click(event: MouseEvent, targetElement: HTMLElement): void {
        if (!targetElement) {
            return;
        }

        const clickedInside = this.elementRef.nativeElement.contains(targetElement);
        if (this.isActive && !clickedInside) {
            this.onClickOutside.emit(event);
            this.isActive = false;
        } else if (!this.isActive && clickedInside) {
            this.isActive = true;
        }
    }
}