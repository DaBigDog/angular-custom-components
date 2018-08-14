import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

@Component({
    selector: 'multiselect-dropdown-component',
    template: `
                <div class="form-group">
                    <label>{{label}}</label><br/>
                    <ng-container *ngIf="!isReadOnly; else readOnlyText">
                        <div class="btn-group" click-outside (onClickOutside)="onTouch()">
                            <button type="button" class="btn btn-default dropdown-toggle custom-control" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {{getLabelText}} <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li *ngFor="let item of items">
                                <input type="checkbox" [checked]="isCheckedItem(item)" (change)="addOrRemoveCheckedItem(item)">
                                {{item[textField]}}
                                </li>
                            </ul>
                        </div>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control pre-scrollable bkg-readonly">
                            {{ (selectedItems && 0 < selectedItems.length) ? getLabelText : " "}}
                        </div>
                    </ng-template>
                </div> 
              `,
    styles: ['ul.dropdown-menu{overflow-y:auto;width:25vw;max-height:50vh;padding-left:15px;}input[type="checkbox"]{height:15px;width: 15px;cursor:pointer;margin-right:5px;}button[type="button"].custom-control{white-space:normal;}div.bkg-readonly{background-color: #f9f9f9;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectDropdownComponent),
            multi: true
        }
    ]
})
export class MultiSelectDropdownComponent extends BaseControlValueAccessor {

    @Input() public isReadOnly: boolean;
    @Input() public items: Array<any>;
    @Input() public label: string;
    @Input() public primaryKeyField: string;
    @Input() public textField: string;

    @Output() public onSelectItem = new EventEmitter();

    private selectedItems: Array<any>; //model

    constructor() {
        super();
    }

    ngOnInit() {

    }

    public get getLabelText(): string {
        let dropdownSelectText: string = "Select";
        if (this.selectedItems && this.selectedItems.length > 0) {
            dropdownSelectText = this.selectedItems.map((x) => x[this.textField]).join(", ");
        }
        return dropdownSelectText;
    }

    writeValue(obj: any): void {
        if (this.selectedItems !== obj) {
            this.selectedItems = obj;
        }
    }

    public addOrRemoveCheckedItem(item: any): void {
        let indexOfItem: number = -1;
        if (this.selectedItems) {
            indexOfItem = this.selectedItems.findIndex((x) => x[this.primaryKeyField] == item[this.primaryKeyField]);
        } else {
            this.selectedItems = [];
        }

        if (indexOfItem == -1) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems.splice(indexOfItem, 1);
        }

        this.propagateChange(this.selectedItems);
        this.onSelectItem.emit(this.selectedItems);
    }

    public isCheckedItem(item: any): boolean {
        if (this.selectedItems && this.selectedItems.some((x) => x[this.primaryKeyField] == item[this.primaryKeyField])) {
            return true;
        } else {
            return false;
        }
    }
}


