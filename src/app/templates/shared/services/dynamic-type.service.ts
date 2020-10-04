import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { DynamicItem } from '../models/dynamic-item';
import { FieldConfigCheckboxComponent } from '../../field-config/field-config-checkbox/field-config-checkbox.component';
import { FieldConfigNumberComponent } from '../../field-config/field-config-number/field-config-number.component';
import { FieldConfigStringComponent } from '../../field-config/field-config-string/field-config-string.component';
import { FieldConfigStatictextComponent } from '../../field-config/field-config-statictext/field-config-statictext.component';
import { FieldConfigDropdownComponent } from '../../field-config/field-config-dropdown/field-config-dropdown.component';
import { DesignerFieldComponent } from '../../designer/designer-field/designer-field.component';
import { DesignerFieldsetComponent } from '../../designer/designer-fieldset/designer-fieldset.component';
import { DesignerItemType } from '../models/designer-item-type';
import { FieldConfigDateComponent } from '../../field-config/field-config-date/field-config-date.component';
import { FieldConfigFieldGroupComponent } from '../../field-config/field-config-field-group/field-config-field-group.component';
import { FieldConfigAttachmentComponent } from '../../field-config/field-config-attachment/field-config-attachment.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicTypeService {

  constructor() { }

  getFieldConfigItem(fieldType: DesignerItemType): DynamicItem {
    let fieldConfigItem: DynamicItem;

    switch (fieldType) {
      case DesignerItemType.StringText:
        fieldConfigItem = new DynamicItem(FieldConfigStringComponent);
        break;
      case DesignerItemType.IntText:
      case DesignerItemType.FloatText:
        fieldConfigItem = new DynamicItem(FieldConfigNumberComponent);
        break;
      case DesignerItemType.Checkbox:
        fieldConfigItem = new DynamicItem(FieldConfigCheckboxComponent);
        break;
      case DesignerItemType.Static:
        fieldConfigItem = new DynamicItem(FieldConfigStatictextComponent);
        break;
        case DesignerItemType.DateText:
        fieldConfigItem = new DynamicItem(FieldConfigDateComponent);
        break;
      case DesignerItemType.StringDropdown:
      case DesignerItemType.IntDropdown:
        fieldConfigItem = new DynamicItem(FieldConfigDropdownComponent);
        break;
      case DesignerItemType.Attachment:
          fieldConfigItem = new DynamicItem(FieldConfigAttachmentComponent);
        break;
      case DesignerItemType.FieldGroup:
      case DesignerItemType.MultipleFieldGroup:
      case DesignerItemType.ColumnGroup:
        fieldConfigItem = new DynamicItem(FieldConfigFieldGroupComponent);
        break;
    }

    return fieldConfigItem;
  }

  getDesignerItem(fieldType: DesignerItemType): DynamicItem {
    let designerItem: DynamicItem;

    switch (fieldType) {
      case DesignerItemType.StringText:
      case DesignerItemType.IntText:
      case DesignerItemType.FloatText:
      case DesignerItemType.Checkbox:
      case DesignerItemType.Static:
      case DesignerItemType.StringDropdown:
      case DesignerItemType.IntDropdown:
      case DesignerItemType.DateText:
      case DesignerItemType.Attachment:
        designerItem = new DynamicItem(DesignerFieldComponent);
        break;
      case DesignerItemType.FieldGroup:
      case DesignerItemType.MultipleFieldGroup:
      case DesignerItemType.ColumnGroup:
        designerItem = new DynamicItem(DesignerFieldsetComponent);
        break;
    }

    return designerItem;
  }
}
