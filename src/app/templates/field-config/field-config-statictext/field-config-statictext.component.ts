import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';

@Component({
  selector: 'field-config-statictext',
  templateUrl: './field-config-statictext.component.html',
  styleUrls: ['./field-config-statictext.component.scss']
})
export class FieldConfigStatictextComponent extends FieldConfigComponent implements OnInit {
  constructor() {
    super();

    this.hideDefaultValueField = true;
    this.hidePlaceholderTextField = true;
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
            className: 'col-12',
            key: 'isTermAndConditions',
            type: 'checkbox',
            defaultValue: false,
            templateOptions: {
              label: 'Is Term & Conditions?',
            }
          },
        ]
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12',
            key: 'text',
            type: 'textarea',
            templateOptions: {
              rows: 4,
              label: 'Static Text',
              required: true,
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
