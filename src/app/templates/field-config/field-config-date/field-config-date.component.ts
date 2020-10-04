import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';

@Component({
  selector: 'field-config-date',
  templateUrl: './field-config-date.component.html',
  styleUrls: ['./field-config-date.component.scss']
})
export class FieldConfigDateComponent extends FieldConfigComponent implements OnInit  {
  constructor() {
    super();
  }

  ngOnInit() {
    this.setupModel();
    this.setupFields();
  }

  protected setupModel() {
    super.setupModel();
  }

  protected setupFields() {
    const fields: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-4',
            key: 'minimumDate',
            type: 'input',
            templateOptions: {
              label: 'Minimum Date',
              type: 'date',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }, {
            className: 'col-4',
            key: 'maximumDate',
            type: 'input',
            templateOptions: {
              label: 'Maximum Date',
              type: 'date',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }, {
            className: 'col-4',
            key: 'DateFormat',
            type: 'input',
            templateOptions: {
              label: 'Date Format',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }
        ]
      }
    ];

    super.setupFields(fields);
  }
}
