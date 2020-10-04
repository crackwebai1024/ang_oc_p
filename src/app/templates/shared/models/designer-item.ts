import { DesignerSection } from './designer-section';
import { DesignerBaseItem } from './designer-base-item';
import { DesignerItemType } from './designer-item-type';
import { DesignerDropdownListItem } from './designer-dropdownlist-item';
import { DesignerDropdownList } from './designer-dropdownlist';

export class DesignerItem extends DesignerBaseItem {
  public clientID: string;
  public isRequired: boolean;
  public placeHolderText: string;
  public type: DesignerItemType;
  public minimumLength: number;
  public maximumLength: number;
  public regEx?: string;
  public defaultValue: any;
  public isMappedField: boolean;
  public isSystemField: boolean;
  public isDuplicate: boolean;
  public isFieldType?: boolean;
  public isGlobal?: boolean;
  public items: Array<DesignerItem>;
  public listName?: string;
  public customList?: DesignerDropdownList;
  public minimumValue: number;
  public maximumValue: number;
  public dateFormat?: string;
  public decimalPrecision?: number;
  public text: string;
  public cssClass: string;
  public validationAction?: string;
  public validationField?: string;
  public validationOperator?: string;
  public validationValue?: string;
  public isTermAndConditions?: boolean;

  constructor(name?: string, displayName?: string, type?: DesignerItemType) {
    super();

    this.name = name;
    this.displayName = displayName;
    this.type = type;

    this.isMappedField = false;
    this.isSystemField = false;
    this.isDuplicate = false;
   }
}
