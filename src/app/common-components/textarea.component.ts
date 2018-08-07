import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'textarea-component',
    template: `
                <div class="form-group">
                    <label *ngIf="!!label">{{label}}</label>
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <textarea class="form-control custom-control" [placeholder]="placeholder" [style.font-size]="fontSize" [style.font-weight]="fontWeight" (change)="onTextEntered($event)" (blur)="onTouch()" (keyup)="onTextEntered($event)" [(ngModel)]="model" [rows]="inputRows"></textarea>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control pre-scrollable bkg-readonly" [style.font-size]="fontSize" [style.font-weight]="fontWeight" [innerHTML]="model">
                        </div>
                    </ng-template>
                </div>
              `,
    styles: ['div.bkg-readonly{background-color: #f9f9f9;height:100%;max-height:20vh;min-height:8vh; white-space:pre-wrap;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TextAreaComponent),
            multi: true
        }
    ]
})
export class TextAreaComponent extends BaseControlValueAccessor {
    @Input() private isReadOnly: boolean;
    @Input() private label: string;
    @Input() private placeholder: string;
    @Input() private fontSize: string;
    @Input() private fontWeight: number = 400;      // Default
    @Input() private inputRows: number = 2;         // Default

    @Output() private enteredText = new EventEmitter();

    private _model: any;
    private get model(): any {
        return (this._model) ? this._model : "";
    }

    private set model(val: any) {
        this._model = val;
    }

    constructor() {
        super();
    }

    writeValue(obj: any): void {//obj is data that is passed in as ngModel from textarea-component
        if (obj !== this.model) {
            this.model = obj;
        }
    }

    private onTextEntered($event: any): void {
        this.propagateChange(this.model);
        this.enteredText.emit({ Text: this.model });
    }
}