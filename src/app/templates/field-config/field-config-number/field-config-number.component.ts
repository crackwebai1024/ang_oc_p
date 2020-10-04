import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'field-config-number',
  templateUrl: './field-config-number.component.html',
  styleUrls: ['./field-config-number.component.scss']
})
export class FieldConfigNumberComponent extends FieldConfigComponent implements OnInit {
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
            key: 'minimumValue',
            type: 'input',
            templateOptions: {
              label: 'Minimum Value',
              type: 'number',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }, {
            className: 'col-6',
            key: 'maximumValue',
            type: 'input',
            templateOptions: {
              label: 'Maximum Value',
              type: 'number',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          },
          {
            className: 'col-6',
            key: 'decimalPrecision',
            type: 'input',
            templateOptions: {
              label: 'Decimal Precision',
              type: 'number',
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
            hideExpression: this.item.type !== DesignerItemType.FloatText
          }
        ]
      }
    ];

    super.setupFields(fields);
  }
}
