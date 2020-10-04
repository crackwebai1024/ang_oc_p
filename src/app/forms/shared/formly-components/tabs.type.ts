import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-tabs',
  template: `
  <mat-tab-group [selectedIndex]="selectedIndex" (selectedTabChange)="tabClick($event)" class="pb-3">
    <mat-tab *ngFor="let tab of field.fieldGroup; let i = index; let last = last;"
      [label]="tab.templateOptions.label"
      [disabled]="selectedIndex < i">
      <formly-field [field]="tab"></formly-field>
      <div>
        <button type="button" (click)="previousStep()" class="btn btn-info btn-sm" *ngIf="selectedIndex != 0">
          Prev
        </button>
        <button type="button" (click)="nextStep()" class="btn btn-info btn-sm float-right" *ngIf="selectedIndex != field.fieldGroup.length -1" [disabled]="!isValid(field.fieldGroup[i])">
          Next
        </button>
      </div>
    </mat-tab>
  </mat-tab-group>
`,
})
export class FormlyFieldTabs extends FieldType {
  selectedIndex: number = 0;

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }
    return field.fieldGroup.every(f => this.isValid(f));
  }

  nextStep() {
    this.selectedIndex = this.selectedIndex + 1;
  }

  previousStep() {
    this.selectedIndex = this.selectedIndex - 1;
  }

  tabClick(tab) {
    this.selectedIndex = tab.index;
  }
}