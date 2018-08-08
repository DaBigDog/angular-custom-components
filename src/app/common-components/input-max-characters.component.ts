import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'input-max-characters',
    template: `
                <div class="form-group">
                    <label *ngIf="label">{{label}}</label>
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <input type="text" class="form-control custom-control" [placeholder]="placeholder" (keypress)="onKeyPress($event)" (change)="onTextEntered($event)" (blur)="onTouch()" (keyup)="onTextEntered($event)" [(ngModel)]="model">
                                <div class="alert alert-danger alert-dismissable" *ngIf="true===displayAlert">
                                <a href="#" class="close" data-dismiss="alert" aria-label="close" (click)="closeAlert()">&times;</a>
                                {{label}} can only be {{ maxCharacters }} characters.
                            </div>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control bkg-readonly" [ngClass]="{'pre-scrollable':preScrollableDiv}">
                            {{model}}
                        </div>
                    </ng-template>
                </div>
              `,
    styles: ['div.bkg-readonly{background-color: #f9f9f9;height:100%;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputMaxCharactersComponent),
            multi: true
        }
    ]
})
export class InputMaxCharactersComponent extends BaseControlValueAccessor {
    @Input() private isReadOnly: boolean;
    @Input() private label: string;
    @Input() private placeholder: string;
    @Input() private preScrollableDiv: boolean = true;
    @Input() private maxCharacters: number = 10;

    @Output() private onChange = new EventEmitter();

    private model: any;
    private displayAlert: boolean = false;
    writeValue(obj: any): void {
        if (obj !== this.model) {
            this.model = obj;
        }
    }

    private onTextEntered($event: any): void {
        this.propagateChange(this.model);
        this.onChange.emit({ Text: this.model });
    }

    private onKeyPress($event: any, txt: string): boolean {
        if (!(this.maxCharacters > $event.target.value.length)) {
            this.displayAlert = true
            return false;
        }
        return true;
    }
    private closeAlert(): void {
        this.displayAlert = false;
    }
}