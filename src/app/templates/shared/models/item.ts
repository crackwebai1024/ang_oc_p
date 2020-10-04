import { EventEmitter } from '@angular/core';

import { DesignerItem } from './designer-item';
import { DesignerTemplate } from './designer-template';
import { DesignerDropdownList } from './designer-dropdownlist';

/**
 * Item interface is implemented by DesignerFieldComponent and DesignerFieldsetComponent and
 * used by DesignerItemComponent.
 */
export interface Item {
  item: DesignerItem;
  templateInstance: DesignerTemplate;
  dropdowns: Array<DesignerDropdownList>;
  displayId: string;
  delete: EventEmitter<DesignerItem>;

  editItem(focusDelay?: number);
}
