import { Component, EventEmitter, ElementRef, Input, Output, AfterViewChecked, ChangeDetectorRef, TemplateRef, OnInit } from '@angular/core';
import { FocusService } from '@creditpoint/spa';
import { Util } from '@creditpoint/util';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { Item } from '../../shared/models/item';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';
import { DesignerService } from '../../shared/services/designer.service';
import * as shortid from 'shortid';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'designer-field',
  templateUrl: './designer-field.component.html',
  styleUrls: ['./designer-field.component.scss']
})
export class DesignerFieldComponent implements OnInit, AfterViewChecked, Item {
  @Input() item: DesignerItem;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  @Input() inMappedFieldset: boolean = false;
  displayId: string;
  editTitleMode: boolean = false;
  editTitleValue: string;
  editFieldMode: boolean = false;
  modalRef: BsModalRef;
  isAttachment: boolean;
  @Output() delete = new EventEmitter<DesignerItem>();

  constructor(
    private el: ElementRef,
    private cdRef: ChangeDetectorRef,
    private focusService: FocusService,
    private designerService: DesignerService,
    private modalService: BsModalService) {

  }

  ngOnInit() {
    this.isAttachment = this.item.type === DesignerItemType.Attachment;
  }

  ngAfterViewChecked() {
    /**
     * This error started to surface about the time we started configuring field config components.
     * Not sure exactly why, but a fix was posted on StackOverflow.
     *
     * ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.
     * Previous value: 'ngIf: undefined'. Current value: 'ngIf: false'.
     *
     * https://stackoverflow.com/questions/43513421/ngif-expression-has-changed-after-it-was-checked
     */
    this.cdRef.detectChanges();
  }

  editTitle() {
    // Show input.
    this.editTitleMode = true;

    // Copy field display name to edit value.
    this.editTitleValue = this.item.displayName;

    // Focus cursor on input.
    setTimeout(() => {
      const input: HTMLElement = this.el.nativeElement.querySelector('input[type="text"]');
      input.focus();

      this.focusService.showFocus = true;
    }, 250);
  }

  confirmTitleEdit() {
    // Copy edit value to field display name.
    this.item.displayName = this.editTitleValue;

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);

    // Clear edit value.
    this.editTitleValue = '';

    this.closeTitleEdit();
  }

  cancelTitleEdit() {
    // Clear edit value.
    this.editTitleValue = '';

    this.closeTitleEdit();
  }

  private closeTitleEdit() {
    // Hide input.
    this.editTitleMode = false;

    if (!Util.isEmpty(this.displayId)) {
      if (this.displayId === this.item.id) {
        this.editItem();
      }
    } else {
      // Remove focus.
      this.focusService.showFocus = false;
    }
  }

  editItem(focusDelay?: number) {
    this.editFieldMode = true;

    if (this.editFieldMode) {
      setTimeout(() => {
        this.focusService.showFocus = true;
      }, (focusDelay !== undefined ? focusDelay : 750));
    }
  }

  onFieldConfigComplete(complete: boolean) {
    this.closeFieldEdit();

    if (complete) {
      // Update designer service changed flag.
      this.designerService.updateChangedStatus(true);
    }
  }

  private closeFieldEdit() {
    const card: HTMLElement = this.el.nativeElement.querySelector('.card');
    card.className = 'animated fadeOutUp card';

    setTimeout(() => {
      this.focusService.showFocus = false;
      this.editFieldMode = false;
      card.className = 'animated fadeInDown card';

      if (!Util.isEmpty(this.displayId)) {
        this.displayId = null;
      }
    }, 750);
  }

  deleteItem(modalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplate);
  }

  confirmDelete() {
    this.delete.emit(this.item);
    this.modalRef.hide();

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);
  }

  declineDelete() {
    this.modalRef.hide();
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
