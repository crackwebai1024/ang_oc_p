import { DesignerBaseItem } from './designer-base-item';
import { DesignerItem } from './designer-item';

export class DesignerSection extends DesignerBaseItem {
  public items?: Array<DesignerItem>;

  constructor(displayName: string) {
    super();

    this.displayName = displayName;
    this.name = this.id; // uniqueify the name

    this.items = new Array<DesignerItem>();
  }
}
