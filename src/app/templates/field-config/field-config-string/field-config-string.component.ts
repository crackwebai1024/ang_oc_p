import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';

@Component({
  selector: 'field-config-string',
  templateUrl: './field-config-string.component.html',
  styleUrls: ['./field-config-string.component.scss']
})
export class FieldConfigStringComponent extends FieldConfigComponent implements OnInit {
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
            className: 'col-6',
            key: 'regEx',
            type: 'input',
            templateOptions: {
              label: 'Match Pattern',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          },
          {
            className: 'col-6',
            key: 'fieldType',
            type: 'select',
            templateOptions: {
              label: 'Type',
              options: [
                {label: 'Text', value: 'text'},
                {label: 'Email', value: 'email'},
                {label: 'SSN', value: 'SSN'},
              ],
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
          },
        ]                                                                                                          
      }
    ];

    super.setupFields(fields);
  }
}
