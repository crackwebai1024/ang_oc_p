import { Injectable } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { parseDate } from '@telerik/kendo-intl';
import * as moment from 'moment';
import { Util } from '@creditpoint/util';

import { _ } from '../../shared/lodash-extensions';
import { ClientSettingsService } from '@creditpoint/spa';

@Injectable()
export class TemplateMappingService {

  companyFields: string[] = [
    'companyBusinessName',
    'companyCountry',
    'companyAddress1',
    'companyCity',
    'companyState',
    'companyPostalCode',
    'companyCountry'
  ];

  sourceObject: any;
  requiredFiles: object[];


  constructor(private clientSettingsService: ClientSettingsService) {
  }

  //#region Model (Credit Apps)
  generateModels(sourceCreditApp: any | string, isNewCreditApp: boolean) {
    this.sourceObject = this.getSourceObject(sourceCreditApp);

    const models: any = [];

    this.sourceObject.steps.forEach(step => {
      const model: any = {};
      step.sections.forEach(section => {
        model[section.name] = {};
        section.items.forEach(item => {
          if (item.type.toLowerCase() === 'fieldgroup'
              && item.hasOwnProperty('items')
              && Array.isArray(item.items)
              && item.items.length > 0) {
                item.items.forEach(fieldGroupItem => {
                  model[section.name][item.name] = model[section.name][item.name] || {};
                  if (fieldGroupItem.type.toLowerCase() === 'columngroup'
                    && fieldGroupItem.hasOwnProperty('items')
                    && Array.isArray(fieldGroupItem.items)
                    && fieldGroupItem.items.length > 0) {
                      fieldGroupItem.items.forEach(columnGroupItem => {
                        model[section.name][item.name][fieldGroupItem.name] = model[section.name][item.name][fieldGroupItem.name] || {};
                        model[section.name][item.name][fieldGroupItem.name][columnGroupItem.name] = this.evaluateParseStrategy(columnGroupItem);
                      });
                  } else {
                    model[section.name][item.name][fieldGroupItem.name] = this.evaluateParseStrategy(fieldGroupItem);
                  }
                });
          } else if (item.type.toLowerCase() === 'columngroup'
              && item.hasOwnProperty('items')
              && Array.isArray(item.items)
              && item.items.length > 0) {
                item.items.forEach(columnGroupItem => {
                  model[section.name][item.name] = model[section.name][item.name] || {};
                  model[section.name][item.name][columnGroupItem.name] = this.evaluateParseStrategy(columnGroupItem);
                });
          } else if (item.type.toLowerCase() === 'multiplefieldgroup') {
              if (item.hasOwnProperty('instanceGroups')
                && Array.isArray(item.instanceGroups)
                && item.instanceGroups.length > 0) {
                  model[section.name][item.name] = model[section.name][item.name] || [];
                  item.instanceGroups.forEach(instanceGroup => {
                    const multiGroup: any = {};
                    instanceGroup.forEach(instanceGroupItem => {
                      if (instanceGroupItem.type.toLowerCase() === 'columngroup'
                          && instanceGroupItem.hasOwnProperty('items')
                          && Array.isArray(instanceGroupItem.items)
                          && instanceGroupItem.items.length > 0) {
                        instanceGroupItem.items.forEach(columnGroupItem => {
                        multiGroup[instanceGroupItem.name] = multiGroup[instanceGroupItem.name] || {};
                        multiGroup[instanceGroupItem.name][columnGroupItem.name] = this.evaluateParseStrategy(columnGroupItem);
                      });
                    } else {
                      multiGroup[instanceGroupItem.name] = this.evaluateParseStrategy(instanceGroupItem);
                    }
                    });
                    model[section.name][item.name].push(multiGroup);
                  });
              } else if (!item.hasOwnProperty('instanceGroups')
                  || !Array.isArray(item.instanceGroups)
                  || item.instanceGroups.length === 0) {
                    model[section.name][item.name] = [];
              }
              item.minimumCount = item.minimumCount || 0;
              if (model[section.name][item.name].length < item.minimumCount) {
                model[section.name][item.name].push(item.templateGroup);
              }
          } else {
            model[section.name][item.name] = this.evaluateParseStrategy(item);
          }
        });
      });

      if (localStorage.getItem('capBusiness') !== null) {
        model.systemFields = { CreditsafeID: JSON.parse(localStorage.getItem('capBusiness')).creditsafeId };
      }

      models.push(model);
    });
    return models;
  }

  evaluateParseStrategy(item: any) {
    if (this.companyFields.includes(item.name.split('_')[0]) && localStorage.getItem('capBusiness') !== null) {
      return JSON.parse(localStorage.getItem('capBusiness'))[item.name.split('_')[0]];
    } else {
      return this.getParsedValue(item.value, item.defaultValue, item.type);
    }
  }

  exportModel(sourceModel: any, sourceCreditApp: any | string) {
    const destinationModelObject: any = this.getSourceObject(sourceCreditApp);

    let multiGroups: any[] = null;

    destinationModelObject.steps.forEach(step => {
      step.sections.forEach(section => {
        section.items.forEach(item => {
          if (item.hasOwnProperty('items')
            && Array.isArray(item.items)
            && item.items.length > 0) {
              item.items.forEach(secondLevelField => {
                if (secondLevelField.hasOwnProperty('items')
                    && Array.isArray(secondLevelField.items)
                    && secondLevelField.items.length > 0) {
                      secondLevelField.items.forEach(thirdLevelField => {
                        thirdLevelField.value = this.getParsedValue(_.at(sourceModel, section.name + '.' + item.name + '.' + secondLevelField.name + '.' + thirdLevelField.name)[0], null, thirdLevelField.type);
                      });
                    } else {
                      secondLevelField.value = this.getParsedValue(_.at(sourceModel, section.name + '.' + item.name + '.' + secondLevelField.name)[0], null, secondLevelField.type);
                    }
              });
          } else if (item.hasOwnProperty('templateGroup')
            && Array.isArray(item.templateGroup)
            && item.templateGroup.length > 0) {
              multiGroups = _.at(sourceModel, section.name + '.' + item.name)[0];
              if (Array.isArray(multiGroups)) {
                // Create our instance groups array - this is an array of fieldgroups, which is an array of fields (templateFields)
                item.instanceGroups = [];

                // For each model in the model array (for each bank reference / contact / whatever)
                multiGroups.forEach(multiGroup => {
                  // We want to create a new instanceGroup (which is just a templateGroup with a value)
                  const instanceGroup: any[] = JSON.parse(JSON.stringify(item.templateGroup));
                  // Set values for each field
                  Object.keys(multiGroup).forEach(multiGroupField => {
                    const instanceGroupField: any = instanceGroup
                      .find(instanceGroupItem => instanceGroupItem.name === multiGroupField);
                      if (instanceGroupField !== undefined) {
                        if (instanceGroupField.hasOwnProperty('items')
                        && Array.isArray(instanceGroupField.items)
                        && instanceGroupField.items.length > 0) {
                          instanceGroupField.items.forEach(thirdLevelField => {
                            thirdLevelField.value = this.getParsedValue(multiGroup[multiGroupField][thirdLevelField.name], null, thirdLevelField.type);
                          });
                        } else {
                          instanceGroupField.value = this.getParsedValue(multiGroup[multiGroupField], null, instanceGroupField.type);
                        }
                      }
                  }, this);
                  item.instanceGroups.push(instanceGroup);
                }, this);
              }
          } else {
            item.value = this.getParsedValue(_.at(sourceModel, section.name + '.' + item.name)[0], null, item.type);
          }
        });
      });
    });

    if (!Util.isEmpty(sourceModel.systemFields)) {
      destinationModelObject.systemFields.forEach(sysField => {
        sysField.value = this.getParsedValue(_.get(sourceModel, 'systemFields.' + sysField.name), sysField.value, sysField.type);
      });
    }

    return destinationModelObject;
  }
  //#endregion

  //#region Template (Credit Apps)
  transformTemplate(sourceCreditApp: any | string, isReadOnly: boolean, hideBlankFields: boolean) {
    this.sourceObject = this.getSourceObject(sourceCreditApp);

    const stepConfigs: any[] = [];
    this.requiredFiles = [];

    (this.sourceObject.steps as any[]).sort((a, b) => a.order - b.order).forEach((step, index) => {
      const templateStep: any = this.mapTemplateStep(step, isReadOnly, hideBlankFields, sourceCreditApp, index);
      templateStep.requiredFiles = this.requiredFiles;
      stepConfigs.push(templateStep);
    });
    return stepConfigs;
  }

  private mapTemplateStep(sourceCreditAppStep: any, isReadOnly: boolean, hideBlankFields: boolean, sourceCreditApp: any, stepIndex: number) {
    const fieldConfig: FormlyFieldConfig[] = [];
    let templateStep: any;

    templateStep = {
      key: sourceCreditAppStep.name,
      id: sourceCreditAppStep.id.toString(),
      name: sourceCreditAppStep.name,
      wrappers: ['card'],
      templateOptions: { label: sourceCreditAppStep.displayName }
    };

    const fieldGroup: any[] = [];

    (sourceCreditAppStep.sections as any[]).sort((a, b) => a.order - b.order).forEach(section => {
      fieldGroup.push(this.mapTemplateSection(section, isReadOnly, hideBlankFields, sourceCreditApp, stepIndex));
    });

    templateStep.fieldGroup = fieldGroup;

    fieldConfig.push(templateStep);

    return fieldConfig;
  }

  private mapTemplateSection(sourceCreditAppStepSection: any, isReadOnly: boolean, hideBlankFields: boolean, sourceCreditApp: any, stepIndex: number) {
    const templateSection: any = {
      key: sourceCreditAppStepSection.name,
      id: sourceCreditAppStepSection.id.toString(),
      name: sourceCreditAppStepSection.name,
      wrappers: ['card'],
      templateOptions: { label: sourceCreditAppStepSection.displayName }
    };
    const fieldGroup: any[] = [];

    let hideSection: boolean = true;
    (sourceCreditAppStepSection.items as any[]).sort((a, b) => a.order - b.order).forEach(item => {
      const fieldSectionField = this.mapTemplateField(item, isReadOnly, hideBlankFields, sourceCreditApp, stepIndex, false, [], sourceCreditAppStepSection);
      if (fieldSectionField.hideExpression === false) {
          hideSection = false;
      }
      fieldGroup.push(fieldSectionField);
    });

    if (sourceCreditAppStepSection.items.length === 1
      && (fieldGroup[0].type === 'repeat' || fieldGroup[0].type === 'fieldgroup' || fieldGroup[0].type === 'columngroup')
      && fieldGroup[0].hasOwnProperty('wrappers')) {
        if (fieldGroup[0].type !== 'repeat' && hideBlankFields) {
          templateSection.hideExpression = hideSection;
        }
        delete fieldGroup[0].wrappers;
      }

    templateSection.fieldGroup = fieldGroup;

    return templateSection;
  }

  private mapTemplateField(
    sourceCreditAppStepSectionField: any,
    isReadOnly: boolean,
    hideBlankFields: boolean,
    sourceCreditApp: any,
    stepIndex: number,
    isRepeatableSectionField: boolean,
    cssClasses: string[] = [],
    parentSection: any) {
    if (sourceCreditAppStepSectionField.cssClass !== undefined) {
      cssClasses.push(sourceCreditAppStepSectionField.cssClass);
    }

    const field: any = {
      key: sourceCreditAppStepSectionField.name,
      id: sourceCreditAppStepSectionField.id === null ? null : sourceCreditAppStepSectionField.id.toString(),
      name: sourceCreditAppStepSectionField.name,
      type: this.mapTemplateFieldType(sourceCreditAppStepSectionField),
      templateOptions: this.mapTemplateFieldTemplateOptions(sourceCreditAppStepSectionField, isReadOnly),
      className:  ((cssClasses.length === 0) ? '' : (' ' + cssClasses.toString().replace(/,/g, ' ')))
    };

    if (sourceCreditAppStepSectionField.hasOwnProperty('leftJustify')) {
      if (sourceCreditAppStepSectionField.leftJustify) {
        field.wrappers = null;
      }
    }
    // This is a little awkward but it works
    if (field.type === 'repeat') {
      if (sourceCreditAppStepSectionField.hasOwnProperty('templateGroup')
        && Array.isArray(sourceCreditAppStepSectionField.templateGroup)
        && sourceCreditAppStepSectionField.templateGroup.length > 0) {
          field.fieldArray = { fieldGroup: [] };
          (sourceCreditAppStepSectionField.templateGroup as any[]).sort((a, b) => a.order - b.order).forEach(child => {
            field.fieldArray.fieldGroup.push(this.mapTemplateField(child, isReadOnly, hideBlankFields, sourceCreditApp, stepIndex, true, [], parentSection));
          });
          field.wrappers = ['group'];
      } else {
        field.hideExpression = true;
      }
      if (hideBlankFields
        && sourceCreditAppStepSectionField.hasOwnProperty('instanceGroups')
        && Array.isArray(sourceCreditAppStepSectionField.instanceGroups)
        && sourceCreditAppStepSectionField.instanceGroups.length > 0) {
          let hideRepeatSection: boolean = true;
          for (let x = 0; x < sourceCreditAppStepSectionField.instanceGroups.length; x++) {
            const instanceGroup = sourceCreditAppStepSectionField.instanceGroups[x];
            for (let y = 0; y < instanceGroup.length; y++) {
              const instanceGroupField = instanceGroup[y];
              if ((instanceGroupField.value !== null && instanceGroupField.value !== undefined) && instanceGroupField.value.toString().trim() === '') {
                field.hideExpression = true;
              } else if (instanceGroupField.value === null || instanceGroupField.value === undefined) {
                field.hideExpression = true;
              } else {
                field.hideExpression = false;
                hideRepeatSection = false;
              }
            }
          }
          field.hideExpression = hideRepeatSection;
        }
    } else if (field.type === 'attachment') {
      field.wrappers = ['attachment'];
      const docType = sourceCreditAppStepSectionField.documentType ? sourceCreditAppStepSectionField.documentType : 'Other';
      field.templateOptions = {
        documentType: docType,
        fileList: sourceCreditApp.fileUpload.files.filter(file => file.fileType === docType) || [],
        isRequired: sourceCreditAppStepSectionField.isRequired,
        parentSection: parentSection.name,
        unsubmitted: sourceCreditApp.status.toLowerCase() === 'unsubmitted'
      };
      if (sourceCreditAppStepSectionField.isRequired) {
        this.requiredFiles.push({
          docType: docType,
          parentSection: parentSection.name
        });
      }
      delete field.type;
    } else if (field.type === 'fieldgroup') {
      field.fieldGroup = [];

      if (sourceCreditAppStepSectionField.hasOwnProperty('items')
        && Array.isArray(sourceCreditAppStepSectionField.items)
        && sourceCreditAppStepSectionField.items.length > 0) {
          let hideFieldGroup: boolean = true;
          (sourceCreditAppStepSectionField.items as any[]).sort((a, b) => a.order - b.order).forEach(child => {
            const fieldGroupField = this.mapTemplateField(child, isReadOnly, hideBlankFields, sourceCreditApp, stepIndex, false, [], parentSection);

            if (fieldGroupField.templateOptions.fileList !== undefined && fieldGroupField.templateOptions.fileList.length >= 1) {
              hideFieldGroup = false;
            }

            if (fieldGroupField.hideExpression === false) {
                hideFieldGroup = false;
            }
            field.fieldGroup.push(fieldGroupField);
          });
          if (hideBlankFields) {
            field.hideExpression = hideFieldGroup;
          }
      } else {
          field.hideExpression = true;
      }
      field.wrappers = ['group'];

      delete field.type; // 'type' is not specified for formly fieldgroups
    } else if (field.type === 'columngroup') {
      field.fieldGroup = [];
      field.fieldGroupClassName = 'd-flex w-100';
      if (sourceCreditAppStepSectionField.hasOwnProperty('items')
        && Array.isArray(sourceCreditAppStepSectionField.items)
        && sourceCreditAppStepSectionField.items.length > 0) {
          let hideFieldGroup: boolean = true;
          (sourceCreditAppStepSectionField.items as any[]).sort((a, b) => a.order - b.order).forEach(child => {
            const classes: string[] = [];
            const columnClasses = ['w-25', 'w-50', 'w-75', 'flex-fill'];

            if (child.cssClass === null || child.cssClass === '' || !child.cssClass.split(',').some(x => columnClasses.includes(x))) {
              classes.push('flex-fill');
            }

            if (child.order >= 1) {
              classes.push('ml-1');
            }

            classes.push('whitespace-nowrap');

            const fieldGroupField = this.mapTemplateField(child, isReadOnly, hideBlankFields, sourceCreditApp, stepIndex, false, classes, parentSection);
            if (fieldGroupField.hideExpression === false) {
                hideFieldGroup = false;
            }
            field.fieldGroup.push(fieldGroupField);
          });
      } else {
          field.hideExpression = true;
      }

      delete field.type; // 'type' is not specified for formly fieldgroups
    } else {
      // Go ahead and set the default value of the field
      // to either the actual field value or the default value.
      const defaultValue: any = this.getParsedValue(sourceCreditAppStepSectionField.value,
        sourceCreditAppStepSectionField.defaultValue,
        sourceCreditAppStepSectionField.type.toLowerCase());

      if (defaultValue !== null) {
        field.defaultValue = defaultValue;
      }

      if (field.key === 'companyBusinessName' && this.clientSettingsService.clientSettings.useCreditSafe && sourceCreditApp.status.toLowerCase() === 'unsubmitted') {
        field.wrappers = ['form-field', 'creditsafe'];
      }

      if (field.type === 'static') {
        if (field.className !== undefined && field.className.indexOf('terms-conditions') !== -1) {
          field.type = 'textarea';
          field.templateOptions.rows = 6;
          field.templateOptions.disabled = true;
        }

        field.className = (field.className === '') ? '' : field.className + ' ';
        field.className = field.className + 'd-block';
      }

      if (field.type.toLowerCase() === 'checkbox') {
        if (isReadOnly) {
          field.className = (field.className === '') ? '' : field.className + ' ';
          field.className = field.className + 'printSupport';
        }
        if (field.templateOptions.required) {
          field.validators = (field.validators || {});
          field.validators.validation = ['requiredTrue'];
        }
      }

      if (hideBlankFields) {
        if (isRepeatableSectionField) {
          field.hideExpression = 'model["' + field.name + '"] === undefined || model["' + field.name + '"] === null || model["' + field.name + '"].toString().trim() === ""';
        } else if ((sourceCreditAppStepSectionField.value !== null
          && sourceCreditAppStepSectionField.value !== undefined)
          && sourceCreditAppStepSectionField.value.toString().trim() === '') {
          field.hideExpression = true;
        } else if (sourceCreditAppStepSectionField.value === null
          || sourceCreditAppStepSectionField.value === undefined) {
          field.hideExpression = true;
        } else {
          field.hideExpression = false;
        }
      }
    }

    if (sourceCreditAppStepSectionField.hasOwnProperty('validationAction')
      && !Util.isEmpty(sourceCreditAppStepSectionField.validationAction)) {
        let hideExpression = `model["${sourceCreditAppStepSectionField.validationField}"] ${sourceCreditAppStepSectionField.validationOperator} "${sourceCreditAppStepSectionField.validationValue}"`;
        if(sourceCreditAppStepSectionField.validationAction == "show"){
          hideExpression = `!(${hideExpression})`;
        }

        field.hideExpression = hideExpression;
    }
    return field;
  }

  private mapTemplateFieldType(sourceCreditAppStepSectionField: any) {

    switch (sourceCreditAppStepSectionField.type.toLowerCase()) {
      case 'static':
        if(sourceCreditAppStepSectionField.isTermAndConditions === true)
          return 'terms-conditions';
        return 'static';
      case 'attachment':
        return 'attachment';
      case 'checkbox':
        return 'checkbox';
      case 'stringdropdown':
      case 'intdropdown':
        return 'select';
      case 'fieldgroup':
        return 'fieldgroup';
      case 'columngroup':
        return 'columngroup';
      case 'multiplefieldgroup':
        return 'repeat';
      default:
        return 'input';
    }
  }

  private mapTemplateFieldTemplateOptions(sourceCreditAppField: any, isReadOnly: boolean) {
    const templateOptions: any = {};

    // Is this field readonly?
    if (isReadOnly) {
      templateOptions.disabled = true;
    }

    // Dropdowns
    if ((sourceCreditAppField.type.toLowerCase() === 'stringdropdown' || sourceCreditAppField.type.toLowerCase() === 'intdropdown')
      && sourceCreditAppField.hasOwnProperty('listName')
      && !Util.isEmpty(sourceCreditAppField.listName)) {
        if (this.sourceObject.hasOwnProperty('dropdownLists')) {
          templateOptions.options = this.mapSelectListItems(
            (this.sourceObject.dropdownLists as any[])
            .filter(ddl => ddl !== null && ddl.name === sourceCreditAppField.listName)
            .map(function(ddl) {
                if ('items' in ddl) {
                  return ddl.items;
                }
            })[0]);
          if (!sourceCreditAppField.isRequired) {
            templateOptions.options.splice(0, 0, {
              label: 'No Selection',
              value: null
            });
          }
        }
    }

    // Field type
    const sourceCreditAppFieldType = sourceCreditAppField.type.toLowerCase();
    if (sourceCreditAppFieldType === 'date') {
      templateOptions.type = 'text';
      templateOptions.attributes = templateOptions.attributes || {};
      if (!this.isIE()) {
        templateOptions.attributes.onfocus = `this.type = 'date';`;
      } else {
        templateOptions.pattern = /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/;
      }
    } else if (sourceCreditAppFieldType === 'email') {
      templateOptions.type = 'email';
    } else if (sourceCreditAppFieldType === 'floattext'
      || sourceCreditAppFieldType === 'inttext') {
        templateOptions.type = 'number';
    }

    // Handle multi's
    if (sourceCreditAppFieldType === 'multiplefieldgroup') {
      if (isReadOnly) {
        templateOptions.hideBtn = true;
        templateOptions.hideRemoveBtn = true;
      } else {
        templateOptions.btnText = 'Add';
      }
    }

    // Labels
    if (sourceCreditAppField.type.toLowerCase() === 'static') {
      templateOptions.placeholder = sourceCreditAppField.text;
    } else if (sourceCreditAppField.hasOwnProperty('displayName')
      && !Util.isEmpty(sourceCreditAppField.displayName)) {
        {
          templateOptions.label = sourceCreditAppField.displayName;
        }
    }

    // Placeholders
    if (sourceCreditAppField.hasOwnProperty('placeHolderText')
    && !Util.isEmpty(sourceCreditAppField.placeHolderText)) {
      templateOptions.placeholder = isReadOnly ? null : sourceCreditAppField.placeHolderText;
    }

    // Validation options
    if (sourceCreditAppField.hasOwnProperty('isRequired')
      && !Util.isEmpty(sourceCreditAppField.isRequired)) {
        templateOptions.required = sourceCreditAppField.isRequired;
    }

    if (sourceCreditAppField.hasOwnProperty('minimumLength')
      && !Util.isEmpty(sourceCreditAppField.minimumLength)) {
        templateOptions.minLength = sourceCreditAppField.minimumLength;
    }

    if (sourceCreditAppField.hasOwnProperty('maximumLength')
      && !Util.isEmpty(sourceCreditAppField.maximumLength)
      && sourceCreditAppField.maximumLength !== 0) {
        templateOptions.maxLength = sourceCreditAppField.maximumLength;
    }

    if (sourceCreditAppField.hasOwnProperty('regEx')
    && !Util.isEmpty(sourceCreditAppField.regEx)) {
      templateOptions.pattern = sourceCreditAppField.regEx;
    }

    if (sourceCreditAppField.hasOwnProperty('fieldType')
    && !Util.isEmpty(sourceCreditAppField.fieldType) && sourceCreditAppField.fieldType == "email") {
      templateOptions.pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    } else if (sourceCreditAppField.hasOwnProperty('fieldType')
    && !Util.isEmpty(sourceCreditAppField.fieldType) && sourceCreditAppField.fieldType == "SSN") {
      templateOptions.pattern = /^\(?([0-9]{3})\)?[-]?([0-9]{2})[-]?([0-9]{4})$/;
    }

    if (sourceCreditAppField.hasOwnProperty('minimumDate')
      && !Util.isEmpty(sourceCreditAppField.minimumDate)) {
        templateOptions.attributes = templateOptions.attributes || {};

        templateOptions.attributes.min = moment(sourceCreditAppField.minimumDate).format('YYYY-MM-DD');
    }

    if (sourceCreditAppField.hasOwnProperty('maximumDate')
      && !Util.isEmpty(sourceCreditAppField.maximumDate)) {
        templateOptions.attributes = templateOptions.attributes || {};

        templateOptions.attributes.max = moment(sourceCreditAppField.maximumDate).format('YYYY-MM-DD');
    }

    if (sourceCreditAppField.hasOwnProperty('minimumValue')
      && !Util.isEmpty(sourceCreditAppField.minimumValue)) {
        templateOptions.min = parseInt(sourceCreditAppField.minimumValue, 10);
    }

    if (sourceCreditAppField.hasOwnProperty('maximumValue')
      && !Util.isEmpty(sourceCreditAppField.maximumValue)) {
        templateOptions.max = parseInt(sourceCreditAppField.maximumValue, 10);
    }

    return templateOptions;
  }

  private mapSelectListItems(sourceItems: any[]) {
    const destinationItems: any[] = [];

    if (sourceItems) {
      (sourceItems as any[]).sort((a, b) => {
        if (a.text.toLowerCase() < b.text.toLowerCase()) { return -1; }
        if (a.text.toLowerCase() > b.text.toLowerCase()) { return 1; }
        return 0;
      }).forEach(item => {
        destinationItems.push({
          label: item.text,
          value: item.value
        });
      });
    }

    return destinationItems;
  }

  private getSourceObject(sourceCreditApp: any | string) {
    if (typeof sourceCreditApp === 'string') {
      return JSON.parse(sourceCreditApp);
    } else {
      return sourceCreditApp;
    }
  }
  //#endregion

  //#region Shared
  private getParsedValue(value: any, defaultValue: any, fieldType: string) {
    let result: any = null;

    if (value === 'null') { value = null; }
    if (value === 'undefined' || value === '') { value = undefined; }

    if (typeof value !== 'undefined') {
      result = value;
    } else if (typeof value === 'undefined' && typeof defaultValue !== 'undefined') {
      result = defaultValue;
    }

    if (result === null && fieldType.toLowerCase() === 'checkbox') {
      return false;
    }

    if (result === null) {
      return result;
    }

    switch (fieldType.toLowerCase()) {
      case 'stringtext':
      case 'stringdropdown':
        return result.toString().trim();
      case 'floattext':
        return parseFloat(result);
      case 'inttext':
      case 'intdropdown':
        return parseInt(result, 0);
      case 'date':
        const date: Date = parseDate(result.split('T')[0]);
        if (date !== null) {
          return ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
        } else {
          return null;
        }
      case 'checkbox':
        return result === 'true' || result === true;
    }
  }

  private isIE(): boolean {
    const ua = navigator.userAgent;
    /* MSIE used to detect old browsers and Trident used to newer ones*/
    const is_ie = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
    return is_ie;
  }
  //#endregion
}
