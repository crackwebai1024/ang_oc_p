import { DesignerDropdownListItem } from './designer-dropdownlist-item';
import { DesignerBaseItem } from './designer-base-item';

export class DesignerDropdownList extends DesignerBaseItem {
  public name: string;
  public dataType: string;
  public items?: Array<DesignerDropdownListItem>;

  constructor(name: string, dataType: string) {
    super();

    this.name = name;
    this.dataType = dataType;
    this.items = new Array<DesignerDropdownListItem>();
  }
}
