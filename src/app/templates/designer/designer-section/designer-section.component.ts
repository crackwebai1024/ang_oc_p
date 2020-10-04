import { Component, EventEmitter, ElementRef, OnInit, Input, Output, ViewChild, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import * as shortid from 'shortid';
import { fromEvent } from 'rxjs';

import { DesignerService } from '../../shared/services/designer.service';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { DesignerSection } from '../../shared/models/designer-section';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';
import { Item } from '../../shared/models/item';
import { DesignerItemComponent } from '../designer-item/designer-item.component';
import { DesignerSectionTitleComponent } from '../designer-section-title/designer-section-title.component';
import { Util } from '@creditpoint/util';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';

@Component({
  selector: 'designer-section',
  templateUrl: './designer-section.component.html',
  styleUrls: ['./designer-section.component.scss']
})
export class DesignerSectionComponent implements OnInit, AfterViewInit {
  @Input() section: DesignerSection;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  @ViewChild('modalTemplate') modalTemplate: ElementRef;
  @ViewChildren(DesignerItemComponent) children: QueryList<DesignerItemComponent>;
  displayFieldUid: string;
  modalRef: BsModalRef;
  @Output() deleteOption = new EventEmitter<any>();

  constructor(
    private dragulaService: DragulaService,
    private modalService: BsModalService,
    private designerService: DesignerService) {
  }

  ngOnInit() {
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

  ngAfterViewInit() {
    /**
     * For some reason, this wakes up the QueryList.
     * https://stackoverflow.com/questions/47217441/viewchildren-querylist-array-is-empty-when-children-are-rendered-with-ngfor
     */
    this.children.changes.subscribe({
      next: (cmp) => {}
    });
  }

  onDelete(event: any) {
    this.modalRef = this.modalService.show(this.modalTemplate);
  }

  confirmDelete() {
    this.deleteOption.emit(this.section);
    this.modalRef.hide();

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);
  }

  declineDelete() {
    this.modalRef.hide();
  }

  doesSectionContainMappedFields(): boolean {
    const mappedField = this.section.items.find((field) => {
      return field.isMappedField;
    });

    return mappedField !== undefined ? true : false;
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

      // If this section is not the target, ignore.
      if (this.section.id !== targetId) {
        return;
      }

      /**
       * Now let's grab the item that was dropped. The child we get back is an
       * instance of Item (interface). We check if it's a fieldset via constructor.
       */
      const id = el.getAttribute('data-id');
      const child: Item = this.getChildItemCmpById(id);

      const cl = source.classList;
      const isNewInstance = cl.contains('field-source') || cl.contains('fieldset-source') || cl.contains('fieldtype-source');

      if (isNewInstance) {
        child.item.id = shortid.generate();
        child.item.name = `${child.item.name}_${shortid.generate()}`;

        if (child.item.type === DesignerItemType.FieldGroup || child.item.type === DesignerItemType.MultipleFieldGroup || child.item.type === DesignerItemType.ColumnGroup) {
          this.designerService.addFieldset(child.item.id);
        }

        this.designerService.addField(child.item);
      }
    }, 250);
  }

  private getChildItemCmpById(id: string): Item {
    const itemCmp = this.children.find((child) => child.item.id === id);
    return itemCmp.getChildItem();
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
    if (this.section.id === targetId) {
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
    if (this.section.id === targetId) {
      target.classList.remove('drag-over');
    }
  }

  private addFieldsetFieldsToDesigner(fields: DesignerItem[]) {
    if (!Util.isEmpty(fields)) {
      fields.forEach((field) => {
        this.designerService.addField(field);
      });
    }
  }

  private setItemOrdinals() {
    this.section.items.map(item => {
      item.order = this.section.items.indexOf(item);
    });
  }

  private onDeleteField(field: DesignerItem) {
    // If fieldset, let's remove child fields.
    if (field.type === DesignerItemType.FieldGroup || field.type === DesignerItemType.MultipleFieldGroup || field.type === DesignerItemType.ColumnGroup) {
      if (!Util.isEmpty(field.items)) {
        field.items.forEach((child) => this.designerService.removeField(child));
      }
    }

    // Remove from designer fields.
    this.designerService.removeField(field);

    // Remove from section items.
    this.section.items = this.section.items.filter(item => item.id !== field.id);
  }
}
