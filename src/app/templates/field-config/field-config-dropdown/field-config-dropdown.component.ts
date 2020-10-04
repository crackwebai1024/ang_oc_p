import { Component, OnInit, Input, Inject, ElementRef, ViewChild, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { EditEvent, GridComponent } from '@progress/kendo-angular-grid';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';
import { DesignerDropdownListItem } from '../../shared/models/designer-dropdownlist-item';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';
import { DropdownListService } from '../../shared/services/dropdown-list.service';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

const textPattern = '^[a-zA-Z0-9]+';
const numberPattern = '^[0-9]+';

const hasClass = (el, className) => new RegExp(className).test(el.className);

const isChildOf = (el, className) => {
  while (el && el.parentElement) {
    if (hasClass(el.parentElement, className)) {
      return true;
    }
    el = el.parentElement;
  }
  return false;
};

@Component({
  selector: 'field-config-dropdown',
  templateUrl: './field-config-dropdown.component.html',
  styleUrls: ['./field-config-dropdown.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FieldConfigDropdownComponent extends FieldConfigComponent implements OnInit {
  public formGroup: FormGroup;
  @ViewChild(GridComponent) private grid: GridComponent;
  @ViewChild(DropDownListComponent) private dropdownListItemCollectionPicker: DropDownListComponent;
  private editedRowIndex: number;
  private editItemKey: string;
  private isNew = false;
  private valuePattern: string;
  private dropdownList: DesignerDropdownList = null;
  public dropdownListItemCollectionPickerData: Array<string> = null;

  constructor(
    private renderer: Renderer2,
    private dropdownListService: DropdownListService
  ) {
    super();
  }

  ngOnInit() {
    this.valuePattern = this.item.type === DesignerItemType.StringDropdown ? textPattern : numberPattern;

    this.setupModel();
    this.setupFields();

    // The data source for the dropdown list item collection picker.
    // The picker contains values representing all of the different
    // global dropdown list item collections, such as state, countries, etc.
    // We append a "Custom" item to the top of the list and choose
    // it by default, to initially give the user the option of creating
    // their own custom dropdown list item collection for this particular
    // dropdown field, with the option of making that list global.
    this.dropdownListItemCollectionPickerData = this.dropdowns.map(value => {
      return value.name;
    });
    this.dropdownListItemCollectionPickerData.splice(0, 0, 'Custom');
    this.dropdownListItemCollectionPicker.data = this.dropdownListItemCollectionPickerData;

    // Handle click save
    this.renderer.listen(
      'document',
      'click',
      ({ target }) => {
        if (!isChildOf(target, 'k-grid-content') && !isChildOf(target, 'k-grid-toolbar')) {
          this.save();
        }
      });

    this.renderer.listen(
      'document',
      'keyup',
      ({ target, keyCode }) => {
        if ((<HTMLElement>target).classList.contains('k-textbox') && keyCode === 13) {
          this.save();
        }
      });

    if (this.item.listName !== undefined && this.item.listName !== null) {
      // If this field is already associated with a list,
      // then the list should already be attached to the
      // template's dropdown list collection or it should
      // be present in the dropdowns collection. Go ahead and
      // set the picker's value and populate the grid with
      // the list items.
      if (this.templateInstance.dropdownLists !== undefined) {
        this.dropdownList = this.templateInstance.dropdownLists
        .find(templateDropdownList => {
          return templateDropdownList.name === this.item.listName;
        });
      } else {
        this.dropdownList = this.dropdowns
        .find(globalDropdown => {
          return globalDropdown.name === this.item.listName;
        });
      }
    } else {
      this.dropdownList = new DesignerDropdownList(this.item.name, this.item.type === DesignerItemType.StringDropdown ? 'string' : 'int');
    }

    this.grid.data = this.dropdownList.items;

    if (this.dropdownListItemCollectionPickerData.includes(this.dropdownList.name)) {
      this.dropdownListItemCollectionPicker.writeValue(this.dropdownList.name);
    } else {
      this.dropdownListItemCollectionPicker.writeValue('Custom');  // setting .value does not work. ¯\_(ツ)_/¯
    }
  }

  protected setupModel() {
    super.setupModel();
  }

  protected setupFields() {
    const fields: FormlyFieldConfig[] = [];

    super.setupFields(fields);
  }

  valueChange(value: any) {
    if (value !== 'Custom') {
      // We're using a predefined list of dropdown items.
      this.dropdownList = this.dropdowns.find(templateDropdownList => {
        return templateDropdownList.name === value;
      }) || new DesignerDropdownList(this.item.name, this.item.type === DesignerItemType.StringDropdown ? 'string' : 'int');
    } else {
      this.dropdownList = new DesignerDropdownList(this.item.name, this.item.type === DesignerItemType.StringDropdown ? 'string' : 'int');
    }
    this.grid.data = this.dropdownList.items;
  }

  public get isInEditingMode(): boolean {
    return this.editedRowIndex !== undefined || this.isNew;
  }

  public addHandler(): void {
    this.closeEditor(this.grid);

    this.formGroup = this.createFormGroup({
      'text': '',
      'value': ''
    });

    this.isNew = true;
    this.grid.addRow(this.formGroup);
  }

  public editHandler({ sender, rowIndex, dataItem }: EditEvent): void {
    if (this.formGroup && !this.formGroup.valid) {
      return;
    }

    this.saveRow();
    this.formGroup = this.createFormGroup(dataItem);
    this.editedRowIndex = rowIndex;
    this.editItemKey = dataItem.text;
    sender.editRow(rowIndex, this.formGroup);
  }

  public cancelHandler(): void {
    this.closeEditor(this.grid, this.editedRowIndex);
  }

  public editClick({ dataItem, rowIndex, isEdited }: any): void {
    if (!isEdited) {
      this.editHandler({
        dataItem: dataItem,
        rowIndex: rowIndex,
        sender: this.grid,
        isNew: this.isNew
      });
    }
  }

  private createFormGroup(dataItem) {
    return new FormGroup({
      'text': new FormControl(dataItem.text, Validators.required),
      'value': new FormControl(dataItem.value, Validators.compose([Validators.required, Validators.pattern(this.valuePattern)]))
    });
  }

  public save(): void {
    if (this.formGroup && !this.formGroup.valid) {
      return;
    }

    this.saveRow();

    // Update or set this item's template dropdown list
    // in the template instance dropdowns collection
    if (this.dropdownList !== undefined) {
      this.item.listName = this.dropdownList.name;
      if (this.templateInstance.dropdownLists !== undefined && this.templateInstance.dropdownLists.length > 0) {
        this.templateInstance.dropdownLists = this.templateInstance.dropdownLists.filter(templateDropdownList => {
          return templateDropdownList.name !== this.item.listName;
        });
      } else {
        this.templateInstance.dropdownLists = this.templateInstance.dropdownLists || new Array<DesignerDropdownList>();
      }
      this.templateInstance.dropdownLists.push(this.dropdownList);
    }
  }

  private closeEditor(grid: GridComponent, rowIndex: number = this.editedRowIndex): void {
    this.isNew = false;
    grid.closeRow(rowIndex);
    this.editedRowIndex = undefined;
    this.editItemKey = undefined;
    this.formGroup = undefined;
  }

  private saveRow(): void {
    if (this.isInEditingMode) {
      const listItem = Object.assign({}, this.formGroup.value);

      if (this.isNew) {
        this.dropdownList.items.splice(0, 0, listItem);
      } else {
        Object.assign(
          this.dropdownList.items.find(({ text }) => text === this.editItemKey),
          listItem
        );
      }
      this.grid.data = this.dropdownList.items;
    }
    this.closeEditor(this.grid);
  }
}
