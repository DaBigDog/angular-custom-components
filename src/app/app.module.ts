import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { DropdownTypeaheadComponent} from './common-components/dropdown-typeahead.component';
import { DropdownComponent} from './common-components/dropdown.component';
import { InputMaxCharactersComponent } from './common-components/input-max-characters.component';
import { InputComponent } from './common-components/input.component';
import { MultiSelectDropdownComponent } from './common-components/multiselect-dropdown.component';
import { MultiSelectTypeaheadDropdownComponent} from './common-components/multiselect-typeahead-dropdown.component';
import { NumericNumberComponent} from './common-components/numeric-number.component';
import { TextAreaComponent } from './common-components/textarea.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [ DropdownTypeaheadComponent
    , DropdownComponent
    , InputMaxCharactersComponent
    , InputComponent
    , MultiSelectDropdownComponent
    , MultiSelectTypeaheadDropdownComponent
    , NumericNumberComponent
    , TextAreaComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
