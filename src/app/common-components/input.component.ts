import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'input-component',
    template: `
                <div class="form-group">
                    <label *ngIf="undefined!==label">{{label}}</label>
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <input type="text" class="form-control custom-control" [placeholder]="placeholder" [style.font-size]="fontSize" (change)="onTextEntered($event)" (blur)="onTouch()" (keyup)="onTextEntered($event)" [(ngModel)]="model">
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control bkg-readonly" [style.font-size]="fontSize" [ngClass]="{'pre-scrollable':preScrollableDiv}" [ngStyle]="cssStyles">
                            {{model}}
                        </div>
                    </ng-template>
                </div>
              `,
    styles: ['div.bkg-readonly{background-color: #f9f9f9;height:auto; min-height:2.5em;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputComponent),
            multi: true
        }
    ]
})
export class InputComponent extends BaseControlValueAccessor {
    @Input() private isReadOnly: boolean;
    @Input() private label: string;
    @Input() private placeholder: string;
    @Input() private preScrollableDiv: boolean = true;
    @Input() private fontSize: string;
    @Input() private cssStyles: string;

    @Output() private onChange = new EventEmitter();

    private model: any;

    writeValue(obj: any): void {
        if (obj !== this.model) {
            this.model = obj;
        }
    }

    private onTextEntered($event: any): void {
        this.propagateChange(this.model);
        this.onChange.emit({ Text: this.model });
    }
}