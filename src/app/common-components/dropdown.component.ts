import { Component, Input, Output, EventEmitter, forwardRef, Directive } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidatorFn, Validator, FormControl, AbstractControl } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'dropdown-component',
    template: `
                <div class="form-group">
                    <ng-container *ngIf="label"><label>{{label}}</label><br /></ng-container>
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <div class="btn-group" click-outside (onClickOutside)="onTouch()">
                            <button type="button" class="btn btn-default dropdown-toggle custom-control" [style.font-size]="fontSize" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                {{getDisplayText(selectedType)}}
                                <span class="caret"> </span>
                            </button>
                            <ul class="dropdown-menu pre-scrollable" [style.font-size]="fontSize">
                                <li *ngFor="let type of typesList" role="presentation">
                                    <a role="menuitem" tabindex="-1" href="#" (click)="getSelectedObject(type)">{{type[textField]}}</a>
                                </li>
                            </ul>
                        </div>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control bkg-readonly" [ngClass]="{'pre-scrollable':preScrollableDiv}">
                            {{getDisplayText(selectedType)}}
                        </div>
                    </ng-template>
                </div>
              `,
    styles: ['div.bkg-readonly{background-color: #f9f9f9; height:auto}.custom-control{white-space:normal;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownComponent),
            multi: true
        }
    ]

})

/**********************************************
*   Example:
*
*   <dropdown-component name="NominationType" [isReadOnly]="false" label="Nomination Type" primaryKeyField="TypeKey" textField="TypeName" [typesList]="nominationTypes" [(ngModel)]="record.NominationType" (onSelect)="nominationTypeChange($event)"></dropdown-component>
*
*********************************************/


export class DropdownComponent extends BaseControlValueAccessor {
    @Input() private label: string;
    @Input() private isReadOnly: boolean; // readonly variable
    @Input() private primaryKeyField: string;
    @Input() private textField: string;
    @Input() private typesList: any[];// Type list to fill dropdown values
    @Input() private fontSize: string;
    @Input() private preScrollableDiv: boolean = true;

    private selectedType: any; // selected Type

    @Output() onSelect = new EventEmitter();

    // the dropdown implement 2 way model binding.
    // the new selected Type will be stored in the model property.
    writeValue(obj: any): void {
        if (this.selectedType !== obj) {
            this.selectedType = obj;
        }
    }

    private getDisplayText(currentType: any): string {
        let shortName: string = "Select";
        if (this.itemValid(currentType)) {
            shortName = currentType[this.textField];
        }
        return shortName;
    }

    private getSelectedObject(currentType: any): boolean {

        this.selectedType = currentType;
        this.propagateChange(this.selectedType);
        this.onSelect.emit(this.selectedType);

        return false;
    }


    public itemValid(item: any): boolean {
        let f: boolean = (!!this.typesList && !!this.typesList && !!item);
        if (true === f) {
            if (!!this.primaryKeyField) {
                f = (-1 < this.typesList.findIndex(x => x[this.primaryKeyField] === item[this.primaryKeyField]));
            } else if (!!this.textField) {
                f = (-1 < this.typesList.findIndex(x => x[this.textField] === item[this.textField]));
            } else {
                f = false;
            }
        }
        return f;
    }

}


// directive ONLY does validation for a dropdown with "required" attribute
@Directive({
    selector: 'dropdown-component[required][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DropdownRequired, multi: true }
    ]
})
export class DropdownRequired implements Validator {
    // custom validation for the Dropdown Component
    // overrides the "required" attribute on the dropdown

    private parentComponent: DropdownComponent;
    constructor(private prtComponent: DropdownComponent) {
        this.parentComponent = prtComponent;
    }

    validate(c: FormControl): { [key: string]: any } {

        // if the item is not null AND a valid item in the list....
        if (null !== c.value && this.parentComponent.itemValid(c.value)) {
            return null; // it's valid'
        }
        else {
            return {
                required: {
                    valid: false
                }
            };
        }


    }
}