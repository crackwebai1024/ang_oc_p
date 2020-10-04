import { Component, EventEmitter, ElementRef, OnInit, AfterViewChecked, Input, Output, ChangeDetectorRef, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FocusService } from '@creditpoint/spa';
import { Util } from '@creditpoint/util';
import { DragulaService } from 'ng2-dragula';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as shortid from 'shortid';

import { DesignerService } from '../../shared/services/designer.service';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { Item } from '../../shared/models/item';
import { DesignerFieldComponent } from '../designer-field/designer-field.component';
import { DesignerSectionTitleComponent } from '../designer-section-title/designer-section-title.component';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';
import { DesignerItemComponent } from '../designer-item/designer-item.component';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'designer-fieldset',
  templateUrl: './designer-fieldset.component.html',
  styleUrls: ['./designer-fieldset.component.scss']
})
export class DesignerFieldsetComponent implements OnInit, Item {
  @Input() item: DesignerItem;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  @ViewChild('modalTemplate') modalTemplate: ElementRef;

  displayId: string;
  editTitleMode: boolean = false;
  editTitleValue: string;
  editFieldMode: boolean = false;
  isColumnLayout: boolean;
  modalRef: BsModalRef;
  @Output() delete = new EventEmitter<DesignerItem>();

  constructor(
    private el: ElementRef,
    private cdRef: ChangeDetectorRef,
    private dragulaService: DragulaService,
    private modalService: BsModalService,
    private focusService: FocusService,
    private designerService: DesignerService) {

  }

  ngOnInit() {
    this.isColumnLayout = this.item.type === DesignerItemType.ColumnGroup || false;
    if (Util.isEmpty(this.item.items)) {
      this.item.items = [];
    }

    this.dragulaService.dropModel.subscribe((value) => {
      this.onDropModel(value);
    });

    this.dragulaService.over.subscribe((value) => {
      this.onDragOver(value);
    });

    this.dragulaService.out.subscribe((value) => {
      this.onDragOut(value);
    });
  }

  onDelete() {
    this.modalRef = this.modalService.show(this.modalTemplate);
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

  doesFieldsetContainMappedFields() {
    const mappedField = this.item.items.find((field) => {
      return field.isMappedField;
    });

    return mappedField !== undefined ? true : false;
  }

  onEdit() {
    this.editItem(0);
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
      this.designerService.updateChangedStatus(true);
    }
  }

  private closeFieldEdit() {
    const card: HTMLElement = this.el.nativeElement.querySelector('.card.config');
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

  private onDropModel(value) {
    let bagname: string, el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement;
    [bagname, el, target, source, sibling] = value;

    // Give Angular and DOM time to sync, otherwise child item will be undefined.
    setTimeout(() => {
      // Update mapped ordinals.
      this.setItemOrdinals();

      // Update designer service changed flag.
      this.designerService.updateChangedStatus(true);

      // Ignore self.
      if (target === source) {
        return;
      }

      // Grab target id.
      const targetId = target.getAttribute('data-id');
      // If this fieldset is not the target, ignore.
      if (this.item.id !== targetId) {
        return;
      }

      const cl = source.classList;
      const isNewInstance = cl.contains('field-source') || cl.contains('fieldset-source') || cl.contains('fieldtype-source');
      const recordedChildren = Array.from(this.designerService.getFieldsetChilderen(this.item.id)).map(x => x.id);
      const missingChild = this.item.items.filter(x => !recordedChildren.includes(x.id))[0];

      if (isNewInstance) {
        missingChild.id = shortid.generate();
        missingChild.name = `${missingChild.name}_${shortid.generate()}`;

        if (missingChild.type === DesignerItemType.FieldGroup || missingChild.type === DesignerItemType.MultipleFieldGroup || missingChild.type === DesignerItemType.ColumnGroup) {
          this.designerService.addFieldset(missingChild.id);
        } else {
          this.designerService.addFieldsetField(this.item.id, missingChild);
        }

        this.designerService.addField(missingChild);
      } else {
        this.designerService.removeFieldsetFieldByField(missingChild);
        this.designerService.addFieldsetField(this.item.id, missingChild);
      }
    }, 250);
  }

  private onDragOver(value) {
    let bagname: string, el: HTMLElement, target: HTMLElement, source: HTMLElement;
    [bagname, el, target, source] = value;

    // Ignore self.
    if (target === source) {
      return;
    }

    // Grab target id.
    const targetId = target.getAttribute('data-id');

    // If this section is the target, highlight.
    if (this.item.id === targetId) {
      target.classList.add('drag-over');
    }
  }

  private onDragOut(value) {
    let bagname: string, el: HTMLElement, target: HTMLElement, source: HTMLElement;
    [bagname, el, target, source] = value;

    // Ignore self.
    if (target === source) {
      return;
    }

    // Grab target id.
    const targetId = target.getAttribute('data-id');

    // If this section is the target, remove highlight.
    if (this.item.id === targetId) {
      target.classList.remove('drag-over');
    }
  }

  private setItemOrdinals() {
    this.item.items.map(item => {
      item.order = this.item.items.indexOf(item);
    });
  }

  private onDeleteField(field: DesignerItem) {
    // Remove from designer fields.
    this.designerService.removeField(field);

    // Remove from child items.
    this.item.items = this.item.items.filter(item => item.id !== field.id);
  }
}
