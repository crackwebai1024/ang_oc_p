import { Component, OnInit, Input, Output } from '@angular/core';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';

@Component({
  selector: 'progress-outline',
  templateUrl: './progress-outline.component.html',
  styleUrls: ['./progress-outline.component.scss']
})
export class ProgressOutlineComponent implements OnInit {
  @Input()
  public progressOutline: IProgressOutlineItem;
  @Input()
  public showRoot: boolean;
  @Input()
  public isExisting: boolean;
  // See other comments - I stuck this property here
  // to compensate for the fact that there is for now
  // only one "step" per application. When that changes
  // we can just remove this config option - it doesn't
  // belong in this component, anyway.
  @Input()
  public showSteps: boolean;

  public selectedAnchor: string;
  public manualSelection: boolean;

  constructor(
    private scrollToService: ScrollToService
  ) {}

  ngOnInit() {
  }

  onProgressOutlineItemClick(event, anchor) {
    this.manualSelection = true;
    this.scrollToService.scrollTo({
      target: anchor
    }).subscribe({
      complete: () => {
        this.manualSelection = false;
      }
    });
    this.selectedAnchor = anchor;
  }

}

export interface IProgressOutlineItem {
  anchor: string;
  label: string;
  isRoot: boolean;
  children: Array<IProgressOutlineItem>;
  isStep: boolean;
  isValid: boolean;
}
