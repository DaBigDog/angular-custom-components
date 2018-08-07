import { Component, Input, Output, EventEmitter, forwardRef, Directive, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, ValidatorFn, Validator, FormControl, AbstractControl } from '@angular/forms';


import { BaseControlValueAccessor } from './base-control-value-accessor';

declare var $: any;

@Component({
    selector: 'dropdown-typeahead-component',
    template: `
                <div class="form-group">
                    <ng-container *ngIf="label"><label>{{label}}</label><br /></ng-container>
                    <ng-container *ngIf="!isReadOnly;else readOnlyText">
                        <div class="dropdown custom-control" #dropdown>
                            <div class="input-group dropdown-toggle" click-outside (onClickOutside)="onTouch()" data-toggle="dropdown">
                                <input type="text" class="form-control" [ngModel]="searchText" (ngModelChange)="onSearchModelChange($event)">
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-default" [style.font-size]="fontSize">
                                        <span class="caret"> </span>
                                    </button>
                                </div>
                            </div>
                            <ul class="dropdown-menu dropdown-menu-right pre-scrollable" [style.font-size]="fontSize">
                                <li *ngFor="let type of typesList" role="presentation">
                                    <a role="menuitem" tabindex="-1" href="#" (click)="onTypeSelect(type)" [hidden]="filterDropdownItem(type[textField])">{{type[textField]}}</a>
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
    styles: ['div.bkg-readonly{background-color: #f9f9f9; height:auto}.custom-control{white-space:normal;}.dropdown-menu{width: 100%;}[hidden]{display:none!important;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DropdownTypeaheadComponent),
            multi: true
        }
    ]

})

/**********************************************
*   Example:
*
*   <dropdown-typeahead-component name="NominationType" [isReadOnly]="false" label="Nomination Type" primaryKeyField="TypeKey" textField="TypeName" [typesList]="nominationTypes" [(ngModel)]="record.NominationType" (onSelect)="nominationTypeChange($event)"></dropdown-component>
*
*********************************************/


export class DropdownTypeaheadComponent extends BaseControlValueAccessor {

    @ViewChild("dropdown") dropdownElem: ElementRef;

    @Input() private label: string;
    @Input() private isReadOnly: boolean; // readonly variable
    @Input() private primaryKeyField: string;
    @Input() private textField: string;
    @Input() private fontSize: string;
    @Input() private preScrollableDiv: boolean = true;

    // Type list to fill dropdown values
    @Input() private typesList: any[];

    @Output() onSelect = new EventEmitter();

    private _selectedType: any; // selected Type
    private set selectedType(val: any) {
        this._selectedType = val;
        this.searchText = this.getDisplayText(this.selectedType);
    }
    private get selectedType(): any {
        return this._selectedType;
    }

    private searchText: string;
    

    ngOnInit() {

    }

    ngAfterViewInit() {
        if (this.dropdownElem && this.dropdownElem.nativeElement) {
            // we need to prevent the dropdown from closing AND set the 
            // focus back to the input element when dropdown appears
            $(this.dropdownElem.nativeElement).on({
                "shown.bs.dropdown": function () {
                    this.closable = false;
                    $(this).find("input.form-control").focus();
                },
            });
        }
    }



    // The component implements 2 way model binding.
    // Model value is being written to this compnent.
    writeValue(obj: any): void {
        if (this.selectedType !== obj) {
            this.selectedType = obj;
        }
    }

    // gets the text of the object to display
    private getDisplayText(modelTypeValue: any): string {
        let shortName: string;
        if (this.itemValid(modelTypeValue)) {
            shortName = modelTypeValue[this.textField];
        }
        return shortName;
    }

    // sets the selected item and events when user clicks a list item
    private onTypeSelect(currentType: any): boolean {
        this.selectedType = currentType;

        this.propagateChange(this.selectedType);
        this.onSelect.emit(this.selectedType);

        return false;
    }

    private onSearchModelChange(e: any): void {
        this.searchText = e;

        if (!this.searchTextValid) {
            this.selectedType = undefined;
        }
    }


    // validates and item exists in the types list
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

    // filters list items based on the search text...
    private filterDropdownItem(txt: string) : boolean {
        if (this.searchTextValid) {
            return !(txt.toLowerCase().startsWith(this.searchText.toLowerCase()));
        } else {
            return false;
        }
    }


    private get searchTextValid(): boolean {
        return (this.searchText && 1 < this.searchText.length);
    }

}


// directive ONLY does validation for a dropdown with "required" attribute
@Directive({
    selector: 'dropdown-typeahead-component[required][ngModel]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: DropdownTypeaheadRequired, multi: true }
    ]
})
export class DropdownTypeaheadRequired implements Validator {
    // custom validation for the Dropdown Component
    // overrides the "required" attribute on the dropdown

    private parentComponent: DropdownTypeaheadComponent;
    constructor(private prtComponent: DropdownTypeaheadComponent) {
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