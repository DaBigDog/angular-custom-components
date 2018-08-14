import { Component } from '@angular/core';

import { DataService } from './common-components/data.service'
import { State } from './common-components/state.model'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  public title = 'Angular Custom Components';
  public states : Array<State>;


  public multiSelectStates : Array<State>;
  public multiSelectTypeaheadStates : Array<State> = new Array<State>();

  constructor(private dataService: DataService) {

  }

  ngOnInit() {
    this.loadStatesData();
  }

  private loadStatesData() : void {
    this.dataService.allStates.subscribe(s => {
      this.states = s;
    });
  }

  public onSelectEvent(e: any) : void {
    console.log(e);
  }

}
