import { ControlValueAccessor } from '@angular/forms';

export abstract class BaseControlValueAccessor implements ControlValueAccessor {

    protected propagateChange: Function = (_: any) => { };
    protected propagateTouch: Function = () => { };

    protected onTouch(): void {
        this.propagateTouch();
    }

    writeValue(obj: any): void {

    }

    registerOnChange(fn: any): void {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.propagateTouch = fn;
    }
}