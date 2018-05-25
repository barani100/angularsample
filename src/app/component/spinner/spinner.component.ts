import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { MaterialModule } from '../../component/material/material.module';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})

/**
 * Spinner component
 */
export class SpinnerComponent implements OnInit, OnChanges {

  //spinner properties
  public color = 'primary';
  public mode = 'indeterminate';
  @Input() showSpinner: any;

  constructor() {
    this.showSpinner = true;
  }

  ngOnInit() { }

  /**
   * Method to handle the show and hide functionality of spinner through ngIf directive
   * @param changes 
   */
  ngOnChanges(changes: SimpleChanges): void {
    this.showSpinner = changes['showSpinner'].currentValue;
  }

}
