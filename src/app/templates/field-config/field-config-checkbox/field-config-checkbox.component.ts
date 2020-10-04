import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';

@Component({
  selector: 'field-config-checkbox',
  templateUrl: './field-config-checkbox.component.html',
  styleUrls: ['./field-config-checkbox.component.scss']
})
export class FieldConfigCheckboxComponent extends FieldConfigComponent implements OnInit {
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
            key: 'defaultValue',
            type: 'radio',
            defaultValue: 0,
            templateOptions: {
              label: 'Checkbox Value',
              required: true,
              labelProp: 'label',
              valueProp: 'value',
              options: [
                {label: 'Checked', value: 1},
                {label: 'Unchecked', value: 0}
              ]
            }
          },
          {
            className: 'col-12',
            key: 'leftJustify',
            type: 'checkbox',
            defaultValue: false,
            templateOptions: {
              label: 'Left Justify'
            }
          }
        ]
      }
    ];

    super.setupFields(fields);
  }
}
