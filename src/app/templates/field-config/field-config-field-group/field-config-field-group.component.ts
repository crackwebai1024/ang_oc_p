import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'field-config-field-group',
  templateUrl: './field-config-field-group.component.html',
  styleUrls: ['./field-config-field-group.component.scss']
})
export class FieldConfigFieldGroupComponent extends FieldConfigComponent implements OnInit {

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
    let fields: FormlyFieldConfig[] = [];
    if (this.model.type === DesignerItemType.MultipleFieldGroup) {
      fields = [
        {
          fieldGroupClassName: 'row',
          fieldGroup: [
            {
              className: 'col-6',
              key: 'minimumLength',
              type: 'input',
              templateOptions: {
                label: 'Minimum Length',
                attributes: {
                  class: 'form-control form-control-sm'
                }
              }
            }, {
              className: 'col-6',
              key: 'maximumLength',
              type: 'input',
              templateOptions: {
                label: 'Maximum Length',
                attributes: {
                  class: 'form-control form-control-sm'
                }
              }
            }
          ]
        }
      ];
    } else {
      fields = [];
    }

    super.setupFields(fields);
  }
}
