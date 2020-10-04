import { Component, ElementRef, OnInit, Input } from '@angular/core';
import { FocusService } from '@creditpoint/spa';

import { DesignerTemplate } from '../../shared/models/designer-template';
import { DesignerService } from '../../shared/services/designer.service';

@Component({
  selector: 'designer-template-title',
  templateUrl: './designer-template-title.component.html',
  styleUrls: ['./designer-template-title.component.scss']
})
export class DesignerTemplateTitleComponent implements OnInit {
  @Input() template: DesignerTemplate;
  editMode: boolean = false;
  editValue: string;

  constructor(private el: ElementRef, private focusService: FocusService, private designerService: DesignerService) { }

  ngOnInit() {
  }

  editTitle() {
    // Show input.
    this.editMode = true;

    // Copy heading to edit value.
    this.editValue = this.template.templateName;

    // Focus cursor on input.
    setTimeout(() => {
      const input: HTMLElement = this.el.nativeElement.querySelector('input[type="text"]');
      input.focus();

      this.focusService.showFocus = true;
    }, 250);
  }

  confirmTitleEdit() {
    // Copy edit value to heading.
    this.template.templateName = this.editValue;

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);

    // Clear edit value.
    this.editValue = '';

    this.closeTitleEdit();
  }

  cancelTitleEdit() {
    // Clear edit value.
    this.editValue = '';

    this.closeTitleEdit();
  }

  private closeTitleEdit() {
    // Hide input.
    this.editMode = false;

    // Remove focus.
    this.focusService.showFocus = false;
  }

  cancelKeyDown(evt, direction) {
    if (direction === 'forward') {
      if (evt.keyCode === 9 && !evt.shiftKey) {
        return false;
      }
    } else {
      if (evt.keyCode === 9 && evt.shiftKey) {
        return false;
      }
    }
  }
}
