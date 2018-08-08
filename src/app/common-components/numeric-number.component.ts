import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'numeric-number-component',
    template: `
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <div class="input-group">
                            <input type="number" class="form-control custom-control" [placeholder]="placeholder" (change)="onChangeEvent($event)" (blur)="onTouch()" (keypress)="onKeyPress($event)" (keyup)="onKeyUp($event)" (focusout)="onFocusOut()" [(ngModel)]="model" describedby="basic-addon1">
                            <span class="input-group-addon" id="basic-addon1" *ngIf="showPercentage">%</span>
                        </div>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control pre-scrollable bkg-readonly">
                            {{model}}<span *ngIf="showPercentage">%</span>
                        </div>
                    </ng-template>
              `,
    styles: ['div.bkg-readonly{background-color: #f9f9f9;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NumericNumberComponent),
            multi: true
        }
    ]
})

    /*****
    * Example:
    *  <numeric-number-component name="points" showPercentage=true placeholder="Points" [maximumValue]=100 [minimumValue]=0 [(ngModel)]="testVal"></numeric-number-component>
    *
    ******/

export class NumericNumberComponent extends BaseControlValueAccessor {
    @Input() private isReadOnly: boolean = false;
    @Input() private showPercentage: boolean = false; // show %
    @Input() private placeholder: string;
    @Input() private maximumValue: number; // max value that can be entered
    @Input() private minimumValue: number; // min value that can be entered

    @Output() private onChange = new EventEmitter();

    private model: number;

    writeValue(obj: any): void {
        if (obj !== this.model) {
            this.model = obj;
        }
    }

    private onKeyUp($event: any): void {
        this.onChangeEvent($event);
    }

    private onChangeEvent($event: any): void {

        // 2 decimal point.
        if (undefined !== this.model && null !== this.model)
            this.model = parseFloat(this.model.toFixed(2));

        // check if value below min value and set to min value if it is...
        if (undefined !== this.minimumValue && this.model < this.minimumValue) {
            this.model = this.minimumValue;
        }

        // check if value greater than max value and set to max value if it is...
        if (undefined !== this.maximumValue && this.model > this.maximumValue) {
            this.model = this.maximumValue;
        }
        

        this.propagateChange(this.model);
        this.onChange.emit({ Text: this.model });
    }

    // prevents non-numeric characters and allows decimal points
    // some keystroke, like backspace, are allowed
    private onKeyPress($event: any): any {
        return ($event.charCode == 8 || $event.charCode == 0 || $event.charCode == 13 || $event.charCode == 46) ? null : $event.charCode >= 48 && $event.charCode <= 57;
    }

    // don't let the user leave the field empty
    private onFocusOut(): void {
        if (undefined === this.model || null == this.model) {
            this.model = 0;
            if (undefined !== this.minimumValue) {
                this.model = this.minimumValue;
            }
        }
    }
}