import { Type } from '@angular/core';

/**
 * Used for dynamic component hosts like FieldConfigurator and DesignerItem
 */
export class DynamicItem {
  constructor(public component: Type<any>) {}
}
