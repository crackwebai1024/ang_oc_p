import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';

import { DesignerItem } from './designer-item';
import { DesignerTemplate } from './designer-template';
import { DesignerDropdownList } from './designer-dropdownlist';

/**
 * FieldConfig interface is implemented by FieldConfigComponent and
 * used by FieldConfigurator.
 */
export interface FieldConfig {
  item: DesignerItem;
  templateInstance: DesignerTemplate;
  dropdowns: Array<DesignerDropdownList>;
  form: FormGroup;
  model: DesignerItem;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  saveItem();
}
