import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { DropdownTypeaheadComponent} from './common-components/dropdown-typeahead.component';
import { DropdownComponent} from './common-components/dropdown.component';
import { InputMaxCharactersComponent } from './common-components/input-max-characters.component';
import { InputComponent } from './common-components/input.component';
import { MultiSelectDropdownComponent } from './common-components/multiselect-dropdown.component';
import { MultiSelectTypeaheadDropdownComponent} from './common-components/multiselect-typeahead-dropdown.component';
import { NumericNumberComponent} from './common-components/numeric-number.component';
import { TextAreaComponent } from './common-components/textarea.component';

import { DataService } from './common-components/data.service'

import { ClickOutsideDirective } from './common-components/click-outside.directive'


@NgModule({
  declarations: [
    AppComponent
    , DropdownTypeaheadComponent
    , DropdownComponent
    , InputMaxCharactersComponent
    , InputComponent
    , MultiSelectDropdownComponent
    , MultiSelectTypeaheadDropdownComponent
    , NumericNumberComponent
    , TextAreaComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [ 
    , DataService
    , ClickOutsideDirective ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
