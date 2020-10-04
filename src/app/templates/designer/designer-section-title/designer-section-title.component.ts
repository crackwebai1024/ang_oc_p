import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FocusService } from '@creditpoint/spa';

import { ItemTitle } from '../../shared/models/item-title';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerService } from '../../shared/services/designer.service';

@Component({
  selector: 'designer-section-title',
  templateUrl: './designer-section-title.component.html',
  styleUrls: ['./designer-section-title.component.scss']
})
export class DesignerSectionTitleComponent {
  @Input() item: ItemTitle;
  @Input() isSection: boolean;
  @Input() isColumnLayout: boolean;
  @Input() containsMappedFields: boolean;
  @Input() editFieldMode: boolean;
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  editMode: boolean = false;
  editValue: string;

  constructor(private el: ElementRef, private focusService: FocusService, private designerService: DesignerService) {}

  editTitle() {
    // Show input.
    this.editMode = true;

    // Copy heading to edit value.
    this.editValue = this.item.displayName;

    // Focus cursor on input.
    setTimeout(() => {
      const input: HTMLElement = this.el.nativeElement.querySelector('input[type="text"]');
      input.focus();

      this.focusService.showFocus = true;
    }, 250);
  }

  confirmTitleEdit() {
    // Copy edit value to heading.
    this.item.displayName = this.editValue;

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

  editParent() {
    this.edit.emit(this);
  }

  deleteParent() {
    let canDelete = true;

    if (this.isSection) {
      if (this.containsMappedFields) {
        canDelete = false;
      }
    } else {
      const di = <DesignerItem>this.item;
      if (di.isMappedField || this.containsMappedFields) {
        canDelete = false;
      }
    }

    if (canDelete) {
      this.delete.emit(this);
    }
  }

  getDeleteIconStatus() {
    let cls = 'text-primary';

    if (this.isSection) {
      if (this.containsMappedFields) {
        cls = 'system';
      }
    } else {
      const di = <DesignerItem>this.item;
      if (di.isMappedField || this.containsMappedFields) {
        cls = 'system';
      }
    }

    return cls;
  }

  isMappedFieldset() {
    let isMappedFieldset = false;

    if (!this.isSection) {
      const di = <DesignerItem>this.item;
      isMappedFieldset = di.isMappedField;
    }

    return isMappedFieldset;
  }

  isSystemFieldset() {
    let isSystemFieldset = false;

    if (!this.isSection) {
      const di = <DesignerItem>this.item;
      isSystemFieldset = di.isSystemField;
    }

    return isSystemFieldset;
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
