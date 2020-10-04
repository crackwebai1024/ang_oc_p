import { Input } from '@angular/core';
import { FormGroup, NgForm, FormControl, ValidationErrors } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig, FieldType } from '@ngx-formly/core';

import { DesignerService } from '../services/designer.service';
import { AsideService } from '../services/aside.service';
import { DesignerItem } from '../models/designer-item';
import { FieldConfig } from '../models/field-config';
import { DesignerTemplate } from './designer-template';
import { Util } from '@creditpoint/util';
import { DesignerDropdownList } from './designer-dropdownlist';
import { startWith, map, tap } from 'rxjs/operators';
import { DesignerItemType } from './designer-item-type';


function UniqueFieldNameValidator(control: FormControl): ValidationErrors {
  return !DesignerService.instance.fieldNameExists(control.value) ? null : {
    'fieldName': 'Field name is not unique for this template.'
  };
}

/**
 * Base class used by field-config components.
 */
export class FieldConfigComponent implements FieldConfig {
  @Input() item: DesignerItem;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  form: FormGroup;
  model: DesignerItem;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  hidePlaceholderTextField: boolean;
  hideDefaultValueField: boolean;

  constructor() {
    // Initialize members. We don't initialize this.item because it is passed in from designer.
    this.form = new FormGroup({});
    this.model = new DesignerItem();
    this.options = {};
    this.fields = [];
    this.hidePlaceholderTextField = false;
    this.hideDefaultValueField = false;
  }

  protected setupModel() {
    // Copy item to model.
    this.model = Object.assign(this.model, this.item);
  }

  protected setupFields(childFields: FormlyFieldConfig[]) {
    const fieldNameValidation = [UniqueFieldNameValidator];
    let templateFields = this.getFields();
    templateFields = templateFields.filter(item => item.type != "attachment" && item.type != "static");
    let operators = [
      {
        label: "Equal",
        value: "==",
        allowedTypes: [
          "*"
        ]
      },
      {
        label: "Greater Than",
        value: ">",
        allowedTypes: [
          DesignerItemType.IntText,
          DesignerItemType.FloatText,
          DesignerItemType.DateText
        ]
      },
      {
        label: "Greater Than or Equel",
        value: ">=",
        allowedTypes: [
          DesignerItemType.IntText,
          DesignerItemType.FloatText,
          DesignerItemType.DateText
        ]
      },
      {
        label: "Less Than",
        value: "<",
        allowedTypes: [
          DesignerItemType.IntText,
          DesignerItemType.FloatText,
          DesignerItemType.DateText
        ]
      },
      {
        label: "Less Than or Equel",
        value: "<=",
        allowedTypes: [
          DesignerItemType.IntText,
          DesignerItemType.FloatText,
          DesignerItemType.DateText
        ]
      }
    ]
 
    const baseFields = [
      {
        key: 'isRequired',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'Is Required',
          keydown: function(field, evt) {
            if (evt.keyCode === 9 && evt.shiftKey) {
              return false;
            }
          },
          disabled: (this.item.isSystemField && this.item.isMappedField) ? true : false,
        }
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'displayName',
            type: 'input',
            templateOptions: {
              label: 'Display Name',
              required: true,
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          },
          {
            className: 'col-6',
            key: 'name',
            type: 'input',
            templateOptions: {
              label: 'Field Name',
              required: true,
              disabled: this.item.isSystemField ? true : false,
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
            validators: {
              validation: fieldNameValidation
            }
          }
        ]
      },
      {
        fieldGroupClassName: 'row align-items-center',
        fieldGroup: [
          {
            className: 'col-3',
            key: 'validationAction',
            type: 'select',
            templateOptions: {
              label: 'Validation Action',
              options: [
                {label: 'Show', value: 'show'},
                {label: 'Hide', value: 'hide'},
              ],
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
          },
          {
            className: 'col-3',
            key: 'validationField',
            type: 'select',
            templateOptions: {
              label: 'Validation Field',
              options: templateFields,
              valueProp: 'name',
              labelProp: 'displayName',
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
            expressionProperties: {
              'templateOptions.required': 'model.validationAction != undefined && model.validationAction != ""',
            },
          },
          {
            className: 'col-2',
            key: 'validationOperator',
            type: 'select',
            templateOptions: {
              label: 'Operator',
              options: [],
              attributes: {
                class: 'form-control form-control-sm'
              },
            },
            expressionProperties: {
              'templateOptions.required': 'model.validationField != undefined  && model.validationField != ""',
            },
            hooks: {
              onInit: field => {
                const validationField = this.form.get('validationField');
                field.templateOptions.options = validationField.valueChanges.pipe(
                  startWith(validationField.value),
                  map(validationFieldName => operators.filter(operator=> 
                    {
                      if(validationFieldName == null) return false; 
                      let fieldType = templateFields.find(item => item.name == validationFieldName).type;
                      return operator.allowedTypes.indexOf(fieldType) > -1 || operator.allowedTypes.indexOf("*") > -1;
                    })),
                );
              },
            },
          },
          {
            className: 'col-3',
            key: 'validationValue',
            type: 'input',
            hideExpression: (model) => !(this.model.validationField && [DesignerItemType.Static,DesignerItemType.StringText].indexOf(templateFields.find(item => item.name == this.model.validationField).type) > -1),
            templateOptions: {
              label: 'Validation Value',
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
            expressionProperties: {
              'templateOptions.required': 'model.validationAction != undefined && model.validationAction != ""',
            },
          },
          {
            className: 'col-3',
            key: 'validationValue',
            type: 'input',
            hideExpression: (model) => !(this.model.validationField && [DesignerItemType.DateText].indexOf(templateFields.find(item => item.name == this.model.validationField).type) > -1),
            templateOptions: {
              type:'date',
              label: 'Validation Value',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          },
          {
            className: 'col-3',
            key: 'validationValue',
            type: 'input',
            hideExpression: (model) => !(this.model.validationField && [DesignerItemType.IntText, DesignerItemType.FloatText].indexOf(templateFields.find(item => item.name == this.model.validationField).type) > -1),
            templateOptions: {
              type:'number',
              label: 'Validation Value',
              attributes: {
                class: 'form-control form-control-sm'
              }
            },
            expressionProperties: {
              'templateOptions.required': 'model.validationAction != undefined && model.validationAction != ""',
            },
          },
          {
            className: 'col-3',
            key: 'validationValue',
            type: 'select',
            hideExpression: (model) => !(this.model.validationField && [DesignerItemType.Checkbox, DesignerItemType.IntDropdown, DesignerItemType.StringDropdown].indexOf(templateFields.find(item => item.name == this.model.validationField).type) > -1),
            templateOptions: {
              options: [],
              label: 'Validation Value',
              valueProp: 'value',
              labelProp: 'text',
              attributes: {
                class: 'form-control form-control-sm'
              },
              expressionProperties: {
                'templateOptions.required': 'model.validationAction != undefined && model.validationAction != ""',
              },
            },
            hooks: {
              onInit: field => {
                const validationField = this.form.get('validationField');
                field.templateOptions.options = validationField.valueChanges.pipe(
                  startWith(validationField.value),
                  map(validationFieldName =>
                    {
                      if(validationFieldName == null) return []; 
                      let validationFieldItem = templateFields.find(item => item.name == validationFieldName);

                      console.log(validationFieldItem);
                      console.log(this.dropdowns);
                      console.log(this.templateInstance);
                      if(validationFieldItem.type == DesignerItemType.Checkbox){
                        return [
                          {
                            value:"1",
                            text:"Checked"
                          },
                          {
                            value:"0",
                            text:"Unchecked"
                          }
                        ];
                      }else{
                        let list = this.templateInstance.dropdownLists.find(dropdown => dropdown.name == validationFieldItem.listName);
                        
                        return list!= null? list.items : [];
                      }
                    }
                    ),
                );
              },
            },
          },
          {
            className: 'col-1 pt-2',
            type: 'button',
            templateOptions: {
              text: 'Clear',
              btnType: 'danger btn-sm',
              onClick: ($event) => {
                this.form.get('validationAction').setValue('');
                this.form.get('validationField').setValue('');
                this.form.get('validationOperator').setValue('');
                this.form.get('validationValue').setValue('');
              },
            },
          },
        ]
      }
    ];

    const placeholderAndDefaultFields = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-6',
            key: 'placeHolderText',
            type: 'input',
            hide: this.hidePlaceholderTextField,
            templateOptions: {
              label: 'Placeholder Text',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          },
          {
            className: 'col-6',
            key: 'defaultValue',
            type: 'input',
            hide: this.hideDefaultValueField,
            templateOptions: {
              label: 'Default Value',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }
        ]
      }
    ];

    const cssClass = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12',
            key: 'cssClass',
            type: 'input',
            templateOptions: {
              label: 'Styles',
              placeholder: 'w-25 w-50 w-75 flex-fill',
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }
        ]
      }
    ];

    const globalField = [
      {
        key: 'isGlobal',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: this.item.isFieldType || this.item.isDuplicate ? 'Add to global fields?' : 'Update global field configuration?'
        },
        hideExpression: this.item.isSystemField && !this.item.isDuplicate
      }
    ];

    this.fields = this.fields.concat(baseFields);

    if (!this.hidePlaceholderTextField || !this.hideDefaultValueField) {
      this.fields = this.fields.concat(placeholderAndDefaultFields);
    }

    this.fields = this.fields.concat(childFields, globalField, cssClass);
  }

  saveItem() {
    // Copy model to item.
    this.item = Object.assign(this.item, this.model);

    this.saveGlobalFields(this.item);

    // Reset duplicate flag.
    this.item.isDuplicate = false;
  }

  saveGlobalFields(item) {
    if (item.isDuplicate || item.isFieldType) {
      if (item.isGlobal) {
        this.addGlobalFields(item, item.isGlobal);
      }
    } else {
      if (item.isGlobal) {
        // To get MongoID
        const id  = AsideService.instance.getExistFieldId(item.name);
        if (!Util.isEmpty(id)) {
           this.updateGlobalFields(id, item);
        } else {
          // if item got deleted from global list add it back as new one
          this.addGlobalFields(item, item.isGlobal);
        }
      }
    }
  }

  addGlobalFields(field: DesignerItem, isGlobal: boolean) {
    field.id = null;
    AsideService.instance.addGlobalFields(field, isGlobal).subscribe();
  }

  updateGlobalFields(id: string, field: DesignerItem) {
    field.id = id; // assign mongo id to id before calling PUT
    AsideService.instance.updateGlobalFields(field.id, field).subscribe();
  }

  private getFields():DesignerItem[]{
    let templateFields:DesignerItem[] = [];
    this.templateInstance.steps.forEach(step => {
      step.sections.forEach(section => {
        section.items.forEach(item => {
              if (item.type.toLowerCase() === 't_fieldgroup'
                && item.hasOwnProperty('items')
                && Array.isArray(item.items)
                && item.items.length > 0) {
                  item.items.forEach(fieldGroupItem => {
                    if (fieldGroupItem.type.toLowerCase() === 't_columngroup'
                      && fieldGroupItem.hasOwnProperty('items')
                      && Array.isArray(fieldGroupItem.items)
                      && fieldGroupItem.items.length > 0) {
                        fieldGroupItem.items.forEach(columnGroupItem => {
                          templateFields.push( columnGroupItem)
                        });
                    } else {
                      templateFields.push( fieldGroupItem)
                    }
                  });
            } else if (item.type.toLowerCase() === 't_columngroup'
              && item.hasOwnProperty('items')
              && Array.isArray(item.items)
              && item.items.length > 0) {
                item.items.forEach(columnGroupItem => {
                  templateFields.push( columnGroupItem)
                });
            }else if (item.type.toLowerCase() === 't_multiplefieldgroup') {
              if (item.hasOwnProperty('items')
                && Array.isArray(item.items)
                && item.items.length > 0) {
                  item.items.forEach(instanceGroup => {
                      if (instanceGroup.type.toLowerCase() === 't_columngroup'
                          && instanceGroup.hasOwnProperty('items')
                          && Array.isArray(instanceGroup.items)
                          && instanceGroup.items.length > 0) {
                            instanceGroup.items.forEach(columnGroupItem => {
                            templateFields.push( columnGroupItem)
                        });
                    } else {
                      templateFields.push(instanceGroup)
                    }
                  });
              }
              
          } else {
            templateFields.push( item)
          }
          });
      })
    });

    return templateFields;
  }

}
