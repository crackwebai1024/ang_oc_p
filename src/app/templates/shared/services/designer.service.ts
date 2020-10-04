import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { DesignerItem } from '../models/designer-item';
import { utils } from 'protractor';

@Injectable()
export class DesignerService {
  static instance: DesignerService;
  private fields: Set<DesignerItem>;
  private fieldsetFields: Map<string, Set<DesignerItem>>;
  private changed: boolean = false;
  private changedSubject = new Subject<boolean>();
  changedState = this.changedSubject.asObservable();

  constructor() {
    /**
     * We set a static property to our instance so we can use this service class
     * when dependency injection is not available.
     */
    DesignerService.instance = this;

    // Let's initialize our set and map.
    this.fields = new Set<DesignerItem>();
    this.fieldsetFields = new Map<string, Set<DesignerItem>>();
  }

  getFields() {
    return this.fields;
  }

  getFieldsetFields() {
    return this.fieldsetFields;
  }

  getFieldsetChilderen(key: string) {
    return this.fieldsetFields.get(key);
  }

  addField(field: DesignerItem) {
    this.fields.add(field);
  }

  addFieldsetField(fieldsetId: string, field: DesignerItem) {
    // If fieldset not in map, add it.
    if (!this.fieldsetFields.has(fieldsetId)) {
      this.fieldsetFields.set(fieldsetId, new Set<DesignerItem>());
    }

    // Add field to fieldset set.
    const fields = this.fieldsetFields.get(fieldsetId);
    fields.add(field);
  }

  addFieldset(fieldsetId) {
    this.fieldsetFields.set(fieldsetId, new Set<DesignerItem>());
  }

  removeField(field: DesignerItem) {
    const fields = Array.from(this.fields);
    this.fields = new Set(fields.filter((f) => f.id !== field.id));
  }

  removeFieldsetField(fieldsetId: string, field: DesignerItem) {
    let fieldsSet = this.fieldsetFields.get(fieldsetId);
    const fields = Array.from(fieldsSet);
    fieldsSet = new Set(fields.filter((f) => f.id !== field.id));
  }

  removeFieldsetFieldByField(field: DesignerItem) {
    let fieldsetID: string;
    this.fieldsetFields.forEach((fieldset, key) => {
      fieldset.forEach(item => {
        if (item.id === field.id) {
          fieldsetID = key;
        }
      });
    });
    if (fieldsetID !== undefined) {
      this.removeFieldsetField(fieldsetID, field);
    }
  }

  fieldNameExists(fieldName: string): boolean {
    const fields = Array.from(this.fields);
    const existingField = fields.find(field => field.name === fieldName);
    return existingField !== undefined;
  }

  removeAll() {
    this.fields.clear();
    this.fieldsetFields.clear();
  }

  updateChangedStatus(status: boolean) {
    this.changed = status;

    this.changedSubject.next(this.changed);
  }

  getChangedStatus(): boolean {
    return this.changed;
  }
}
