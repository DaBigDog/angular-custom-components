import { Component, Input, Output, EventEmitter, forwardRef, ViewChild, ElementRef, IterableDiffers } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlValueAccessor } from './base-control-value-accessor';

declare var $: any;

@Component({
    selector: 'multiselect-typeahead-dropdown-component',
    template: `
                <div class="form-group">
                    <label *ngIf="label">{{label}}</label><br/>
                    <ng-container *ngIf="!isReadOnly; else readOnlyText">
                        <div class="dropdown custom-control" #multi>
                            <div class="input-group dropdown-toggle" click-outside (onClickOutside)="onTouch()" data-toggle="dropdown">
                                <input type="text" class="form-control" [ngModel]="searchText" (ngModelChange)="onSearchModelChange($event)">
                                <div class="input-group-btn">
                                    <button type="button" class="btn btn-default" [style.font-size]="fontSize">
                                        <span class="caret"></span>
                                    </button>
                                </div>
                            </div>
                            <ul class="dropdown-menu dropdown-menu-right pre-scrollable" [style.font-size]="fontSize">
                                <li *ngFor="let item of items">
                                    <span class="item" [hidden]="filterDropdownItem(item[textField])">
                                        <input type="checkbox" [checked]="isCheckedItem(item)" (change)="itemSelected(item)">
                                        {{ item[textField] }}
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </ng-container>
                    <ng-template #readOnlyText>
                        <div class="form-control pre-scrollable bkg-readonly">
                            {{ (selectedItems && 0 < selectedItems.length) ? getDisplayText : " "}}
                        </div>
                    </ng-template>
                </div> 
              `,
    styles: ['ul.dropdown-menu{overflow-y:auto;width:25vw;max-height:50vh;padding-left:15px;}input[type="checkbox"]{height:15px;width: 15px;cursor:pointer;margin-right:5px;}button[type="button"].custom-control{white-space:normal;}div.bkg-readonly{background-color: #f9f9f9;}.dropdown-menu{width: 100%;}[hidden]{display:none!important;}'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => MultiSelectTypeaheadDropdownComponent),
            multi: true
        }
    ]
})
export class MultiSelectTypeaheadDropdownComponent extends BaseControlValueAccessor {

    @ViewChild("multi") multidropdownElem: ElementRef;

    @Input() private isReadOnly: boolean;
    @Input() private items: Array<any>;
    @Input() private label: string;
    @Input() private primaryKeyField: string;
    @Input() private textField: string;
    @Input() private fontSize: string;

    @Output() private onSelectType = new EventEmitter();

    private pattern: any; // matching regex pattern
    private differ: any;

    private selectedItems: Array<any>; //model

    private _searchText: string;
    private set searchText(val: string) {
        this._searchText = val;
        this.setRegexPattern();
    }
    private get searchText(): string {
        return this._searchText;
    }

    constructor(private differs: IterableDiffers) {
        super();
        this.differ = differs.find([]).create(null);
    }

    ngAfterViewInit() {
        if (this.multidropdownElem && this.multidropdownElem.nativeElement) {
            // we need to prevent the dropdown from closing AND set the 
            // focus back to the input element when dropdown appears
            $(this.multidropdownElem.nativeElement).on({
                "shown.bs.dropdown": function () {
                    this.closable = false;
                    $(this).find("input.form-control").focus();
                },
            });
        }
    }

    ngDoCheck() {
        // watch for changes to the selected items array... push, pop, etc.
        const change = this.differ.diff(this.selectedItems);
        if (change) {
            this.searchText = this.getDisplayText;
        }
    }

    private get getDisplayText(): string {
        if (this.selectedItems && this.selectedItems.length > 0) {
            return this.selectedItems.map((x) => x[this.textField]).join(", ");
        } else {
            return "";
        }
    }

    writeValue(obj: any): void {
        if (this.selectedItems !== obj) {
            this.selectedItems = obj;
        }
    }

    private itemSelected(item: any): void {
        let indexOfItem: number = this.selectedItems.findIndex((x) => x[this.primaryKeyField] == item[this.primaryKeyField]);

        if (indexOfItem == -1) {
            this.selectedItems.push(item);
        } else {
            this.selectedItems.splice(indexOfItem, 1);
        }

        this.propagateChange(this.selectedItems);
        this.onSelectType.emit({ SelectedItems: this.selectedItems });
    }

    private isCheckedItem(item: any): boolean {
        if (this.selectedItems.some((x) => x[this.primaryKeyField] == item[this.primaryKeyField])) {
            return true;
        } else {
            return false;
        }
    }

    
    private setRegexPattern(): void {
        let query: string = "";
        if (this.searchText && -1 < this.searchText.indexOf(',')) {
            let s: string[] = this.searchText.split(",");
            s.forEach(x => {
                query += x.trim() + "|";
            })
            query = query.substring(0, query.length - 1);
        } else {
            query = this.searchText;
        }
        this.pattern = new RegExp('^' + query, 'i');
    }

    private onSearchModelChange(e: any): void {
        this.searchText = e;
    }


    // filters list items based on the search text...
    private filterDropdownItem(txt: string): boolean {
        if (this.searchTextValid) {
            return !(this.pattern.test(txt));
        } else {
            return false;
        }
    }

    private get searchTextValid(): boolean {
        return (this.searchText && 1 < this.searchText.length);
    }

}


