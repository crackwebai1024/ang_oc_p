import { Component, OnInit, ComponentFactoryResolver, Injector, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { FormGroup, Validators } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ComponentDeactivate, AuthService, ClientSettingsService, ClientSettings, FocusService, SpaConfigService } from '@creditpoint/spa';
import { Util } from '@creditpoint/util';
import { DragulaService } from 'ng2-dragula';
import { ToasterService } from 'angular2-toaster';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { TemplateService } from '../../shared/services/template.service';
import { DesignerService } from '../../shared/services/designer.service';
import { AsideHostComponent } from '../../aside/aside-host/aside-host.component';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerSection } from '../../shared/models/designer-section';
import { DesignerFileUpload } from '../../shared/models/designer-file-upload';
import { DesignerStep } from '../../shared/models/designer-step';
import { AsideService } from '../../shared/services/aside.service';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';
import { SpecificUpload } from '../../shared/models/designer-required-file-upload';
import { DocumentTypeModel } from '../../shared/models/document-type.model';
import { ThemeDataService } from '../../../shared/services/themes.service';
import { Theme } from '../../../shared/models/theme';
import { FormStyleOption } from '../../shared/models/form-style-option';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'designer',
  templateUrl: './designer-step.component.html',
  styleUrls: ['./designer-step.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DesignerStepComponent implements OnInit, OnDestroy, ComponentDeactivate {
  templateInstance: DesignerTemplate = null;
  dropdowns: Array<DesignerDropdownList>;
  @ViewChild('modalTemplate') modalTemplate: ElementRef;
  modalRef: BsModalRef;
  nextState: RouterStateSnapshot = null;
  editSettingsToggle: boolean = false;
  editSettingsMode: boolean = false;
  settingsForm = new FormGroup({});
  settingsModel: any;
  settingsOptions: FormlyFormOptions = {};
  settingsFields: FormlyFieldConfig[] = [];
  formChanged: boolean = false;
  clientSettings: ClientSettings;
  themesDropdown: any[];

  constructor(
    private el: ElementRef,
    private route: ActivatedRoute,
    private configService: SpaConfigService,
    private dragulaService: DragulaService,
    private toaster: ToasterService,
    private templateService: TemplateService,
    private designerService: DesignerService,
    private asideService: AsideService,
    private modalService: BsModalService,
    private authService: AuthService,
    private focusService: FocusService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private router: Router,
    private clientSettingsService: ClientSettingsService,
    private themeService: ThemeDataService) {

    this.clientSettings = this.clientSettingsService.clientSettings;

    // Reset designer service changed status.
    this.designerService.updateChangedStatus(false);

    if (Util.isEmpty(this.route.snapshot.data.template)) {
      this.addNewTemplate();
    } else {
      this.templateInstance = this.route.snapshot.data.template;
      this.updateMappedFields();
    }

    this.dropdowns = this.route.snapshot.data.dropdowns;

    this.updateDesignerFields();
  }

  ngOnInit() {
    this.configService.hideAside = false;
    this.configService.asideComponentContext = {
      component: AsideHostComponent,
      factory: this.componentFactoryResolver,
      injector: this.injector
    };

    this.dragulaService.setOptions('section-bag', {
      moves: (el: HTMLElement, source: HTMLElement, handle: HTMLElement) => {
        const cl = handle.classList;
        return (cl.contains('card-header') || cl.contains('card-heading')) && cl.contains('section');
      }
    });

    this.dragulaService.setOptions('field-bag', {
      accepts: (el: HTMLElement, target: HTMLElement, source: HTMLElement) => {
        // Always accept self.
        if (target === source) {
          return true;
        }

        /**
         * Prevent new fieldsets from being dropped inside another fieldset.
         */
        if (source.classList.contains('fieldset-source') && target.classList.contains('fieldset')) {
          return false;
        }

        /**
         * When item being dragged comes from an existing section or fieldset, then el is and instance
         * of <designer-item> and child is either <designer-field> or <designer-fieldset>. Again, let's
         * prevent existing fieldsets from being dropped inside another fieldset.
         */
        if (el.nodeName.toLowerCase() === 'designer-item') {
          const childEl = el.children[0];
          if ((source.classList.contains('fieldset-source') || childEl.nodeName.toLowerCase() === 'designer-fieldset') &&
              target.classList.contains('fieldset')) {
            return false;
          }
        }

        /**
         * Accept targets that are not the aside field list or that do not
         * already contained the dragged item.
         */
        const cl = target.classList;
        const targetIsNotSource = !cl.contains('field-source') && !cl.contains('fieldset-source') && !cl.contains('fieldtype-source');
        return targetIsNotSource;
      },

      // Copy behavior is only applied to the aside field container.
      copy: (el: HTMLElement, source: HTMLElement) => {
        const cl = source.classList;
        return cl.contains('field-source') || cl.contains('fieldset-source') || cl.contains('fieldtype-source');
      },

      revertOnSpill: true
    });

    this.dragulaService.drag.subscribe((value) => {
      this.onDrag(value);
    });

    this.designerService.changedState.subscribe({
      next: (isChanged) => {
        this.formChanged = isChanged;
      }
    });
    this.asideService.currentDocumentDependancy(this.templateInstance.fileUpload.specificFiles);

    this.asideService.addDependancy.subscribe((data: DocumentTypeModel) => {
      const newDependancy: SpecificUpload = {
        fileType: data.DocumentType,
        isRequired: false
      };
      if (this.templateInstance.fileUpload.specificFiles == null) {
          this.templateInstance.fileUpload.specificFiles = new Array();
      }
      this.templateInstance.fileUpload.specificFiles.push(newDependancy);
      this.formChanged = true;
    });

    this.asideService.removeDependancy.subscribe((data: DocumentTypeModel) => {
      const currentDependancy: SpecificUpload[] = this.templateInstance.fileUpload.specificFiles;
      this.templateInstance.fileUpload.specificFiles = currentDependancy.filter(function (item) {
        return item.fileType !== data.DocumentType;
      });
      this.formChanged = true;
    });

    this.themesDropdown = [];
    const themesDropdownCopy = this.themesDropdown;
    this.themeService.getAllThemes().subscribe({
      next: (data) => {
        data.forEach(function(item: Theme) {
          themesDropdownCopy.push({ label: item.displayName, value: item.id });
        });
      },
      error: (data) => {
        console.log('do nothing');
      }
    });
  }

  deleteDocument(documentName: string) {
    const currentDependancy: SpecificUpload[] = this.templateInstance.fileUpload.specificFiles;
    this.templateInstance.fileUpload.specificFiles = currentDependancy.filter(function (item) {
      return item.fileType !== documentName;
    });
    this.formChanged = true;
  }

  requireDocument(index: any, selected: any) {
    this.templateInstance.fileUpload.specificFiles[index].isRequired = selected;
    this.formChanged = true;
  }

  preview() {
    const url = `external-reports/credit-app/new/${this.templateInstance.id};hideBlankFields=False;isPreview=True`;
    window.open(url, '_blank');
  }

  setupSettings() {
    // Set fileUpload if null.
    if (Util.isEmpty(this.templateInstance.fileUpload)) {
      this.templateInstance.fileUpload = new DesignerFileUpload(0, 10, 'Upload documents as instructed.');
    }

    // Copy template DesignerFileUpload instance to model
    this.settingsModel = Object.assign({},
      {fileGroup: this.templateInstance.fileUpload},
      {minimumFiles: this.templateInstance.fileUpload.minimumFiles},
      {maximumFiles: this.templateInstance.fileUpload.maximumFiles},
      {emailBankReferences: this.templateInstance.emailBankReferences},
      {emailTradeReferences: this.templateInstance.emailTradeReferences},
      {eSignatureRequired: this.templateInstance.eSignatureRequired},
      {themeID: this.templateInstance.themeID},
      {formStyle: this.templateInstance.formStyle});

    // Add Formly specific setting to force validation immediately
    Object.assign(this.settingsModel, {showErrorState: true});

    // Setup fields
    this.settingsFields = [
      {
        className: 'section-heading',
        template: '<div>File Upload:</div>'
      },
      {
        fieldGroupClassName: 'row',
        key: 'fileGroup',
        validators: {
          fieldMatch: {
            expression: (control: any) => {
              const value = control.value;
              if (value.minimumFiles <= value.maximumFiles) {
                control.controls.minimumFiles.setErrors(null);
                control.controls.maximumFiles.setErrors(null);
               return true;
              }
            },
            message: 'This value should be less or equal to the maximum file upload value.',
            errorPath: 'minimumFiles',
          }
        },
        fieldGroup: [
          {
            key: 'minimumFiles',
            className: 'col-6',
            type: 'input',
            templateOptions: {
              label: 'Minimum File Uploads',
              required: true,
              type: 'number',
              min: 0,
              addonLeft: {
                class: 'fa fa-upload',
              }
            },
            validators: {
              fieldLessThan: {
                  expression: (control) => control.value <= this.settingsModel.maximumFiles,
                  message: 'This value should be less or equal to the maximum file upload value.',
              },
            }
          },
          {
            key: 'maximumFiles',
            className: 'col-6',
            type: 'input',
            templateOptions: {
              label: 'Maximum File Uploads',
              required: true,
              type: 'number',
              min: 0,
              addonLeft: {
                class: 'fa fa-upload',
              }
            },
            validators: {
              fieldGreaterThan: {
                expression: (control) => control.value >= this.settingsModel.minimumFiles,
                message: 'This value should be greater or equal to the minimum file upload value.',
              },
            }
          }
        ]
      },
      {
        className: 'section-heading',
        template: `<hr /><div>Theme:</div>`
      },
      {
        key: 'themeID',
        type: 'select',
        templateOptions: {
          label: '',
          options: this.themesDropdown
        }
      },
      {
        className: 'section-heading',
        template: `<hr /><div>References:</div>`
      },
      {
        key: 'emailBankReferences',
        className: 'col-12',
        type: 'checkbox',
        defaultValue: 'true',
        templateOptions: {
          label: 'Email Bank References'
        }
      },
      {
        key: 'emailTradeReferences',
        className: 'col-12',
        type: 'checkbox',
        defaultValue: 'true',
        templateOptions: {
          label: 'Email Trade References'
        }
      },
      {
        key: 'eSignatureRequired',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'Require eSignatures',
        },
        hide: !this.clientSettings.useDocusign
      },
      {
        className: 'section-heading',
        template: `<hr />`
      },
      {
        key: 'formStyle',
        type: 'radio',
        defaultValue: FormStyleOption.SinglePage,
        templateOptions: {
          label: 'Form Style',
          options: [
            { value: FormStyleOption.SinglePage, label: 'Single Form' },
            { value: FormStyleOption.Wizard, label: 'Form Wizard' }
          ],
        },
      }
    ];
  }

  // Parses entire template and updated globally tracked designer fields for uniqueness.
  updateDesignerFields() {
    this.templateInstance.steps.forEach((step: DesignerStep) => {
      step.sections.forEach((section: DesignerSection) => {
        section.items.forEach((field: DesignerItem) => {
          this.parseDesignerItems(field);
        });
      });
    });
  }

  parseDesignerItems(field: DesignerItem) {
    this.designerService.addField(field);
    if (!Util.isEmpty(field.items)) {
      field.items.forEach(function(childField: DesignerItem) {
        this.designerService.addFieldsetField(field.id, childField);
        this.parseDesignerItems(childField);
      }.bind(this));
    }
  }

  addNewTemplate() {
    let clientID = this.authService.clientId;
    if (clientID === undefined || clientID === 'null') {
      clientID = null;
    } else {
      clientID = clientID.trim();
    }

    this.templateInstance = new DesignerTemplate(clientID, 'New Template');

    /**
     * Added mapped system fields from global fields list. Flagging isMappedField and isRequired proeprty for
     * business name, requested amount & country for testing. Need to update these flag properties after
     * workflow mapping is done.
     */
    const firstSection = this.templateInstance.steps[0].sections[0];
    this.asideService.getGlobalFields()
      .subscribe(items => {
        (items).filter(item => {
          if (item.isSystemField && Util.isEmpty(item.fields)) {
            // Only add mapped system fields. For now, hard coding these.
            if ((item.name === 'companyBusinessName')
              || (item.name === 'requestedAmount')
              || (item.name === 'companyCountry')) {

                if (item.name === 'companyBusinessName') {
                  item.order = 0;
                } else if (item.name === 'companyCountry') {
                  item.order = 1;
                } else if (item.name === 'requestedAmount') {
                  item.order = 2;
                }

              item.isMappedField = true;
              item.isRequired = true;
              firstSection.items.push(item);
            }
          }
        });
      });
  }

  addPage() {
    this.templateInstance.steps.push(new DesignerStep('New Step'));
  }

  addSection(stepIndex: number) {
    const currentStep = this.templateInstance.steps[stepIndex];
    currentStep.sections.push(new DesignerSection('New Section'));
    this.setSectionOrdinals(stepIndex);

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);
  }

  saveTemplate() {
    // Update section order
    this.setSectionOrdinals(0);

    this.templateInstance.dropdownLists = this.templateInstance.dropdownLists || new Array<DesignerDropdownList>();

    // Purge any extraneous dropdownlist definitions from the template.
    const templateDropdownListsToRemove = new Array<string>();
    this.templateInstance.dropdownLists.forEach(templateDropdownList => {
      if (!this.isDropDownListInUse(templateDropdownList.name)) {
        templateDropdownListsToRemove.push(templateDropdownList.name);
      }
    });
    this.templateInstance.dropdownLists = this.templateInstance.dropdownLists.filter(templateDropdownList => {
      return (!templateDropdownListsToRemove.includes(templateDropdownList.name));
    });

    // Add any missing referenced dropdownlists to the template.
    if (this.dropdowns !== undefined) {
      const dropdownListstoAdd = new Array<DesignerDropdownList>();
      this.dropdowns.forEach(dropdownList => {
        if (this.isDropDownListInUse(dropdownList.name)) {
          dropdownListstoAdd.push(dropdownList);
        }
      });
      dropdownListstoAdd.forEach(dropdownList => {
        if (this.templateInstance.dropdownLists.find(templateDropdownList => {
          return templateDropdownList.name === dropdownList.name;
        }) === undefined) {
          this.templateInstance.dropdownLists.push(dropdownList);
        }
      });
    }

    if (this.templateInstance.id === null) {
      this.templateService.createTemplate(this.templateInstance)
        .subscribe({
          next: (response) => {
            this.toaster.pop('success', 'Saved', 'The template has been saved.');

            this.templateInstance = response;

            this.updateMappedFields();

            // Reset designer service changed status.
            this.designerService.updateChangedStatus(false);

            if (!Util.isEmpty(this.nextState)) {
              // Continue where the user tried to go if set.
              this.router.navigateByUrl(this.nextState.url);
            } else {
              // Otherwise refresh with new id.
              this.router.navigate(['/templates/designer', { id: this.templateInstance.id }]);
            }
          },
          error: (response) => {
            this.toaster.pop('error', 'Error', 'An error occurred creating the template.');
          }
        });
    } else {
      this.templateService.updateTemplate(this.templateInstance)
        .subscribe({
          next: (response) => {
            this.toaster.pop('success', 'Updated', 'The template has been updated.');

            this.templateInstance.modifiedDate = new Date();

            // Reset designer service changed status.
            this.designerService.updateChangedStatus(false);

            // Continue where the user tried to go if set.
            if (!Util.isEmpty(this.nextState)) {
              this.router.navigateByUrl(this.nextState.url);
            }
          },
          error: (response) => {
            this.toaster.pop('error', 'Error', 'An error occurred updating the template.');
          }
        });
    }
  }

  isSettingsValid() {
    return this.settingsForm.valid;
  }

  editSettings() {
    this.editSettingsMode = true;

    // Clear form dirty state and set as valid
    this.settingsForm.markAsPristine();

    if (this.settingsFields.length === 0) {
      this.setupSettings();
    }

    setTimeout(() => {
      this.focusService.showFocus = true;
    }, 750);
  }

  confirmEditSettings() {
    // Copy model to template instance fields.
    this.templateInstance.fileUpload = this.settingsModel.fileGroup;
    this.templateInstance.fileUpload.minimumFiles = this.settingsModel.fileGroup.minimumFiles;
    this.templateInstance.fileUpload.maximumFiles = this.settingsModel.fileGroup.maximumFiles;
    this.templateInstance.emailBankReferences = this.settingsModel.emailBankReferences;
    this.templateInstance.emailTradeReferences = this.settingsModel.emailTradeReferences;
    this.templateInstance.eSignatureRequired = this.settingsModel.eSignatureRequired;
    this.templateInstance.themeID = this.settingsModel.themeID;
    this.templateInstance.formStyle = this.settingsModel.formStyle;

    // Clear form dirty state and set as valid.
    this.settingsForm.markAsPristine();

    // Update designer service changed flag.
    this.designerService.updateChangedStatus(true);

    this.closeSettings();
  }

  cancelEditSettings() {
    // Cancel changes to settings
    const resetValue = {
       fileGroup: this.templateInstance.fileUpload,
       eSignatureRequired: this.settingsModel.eSignatureRequired,
       emailBankReferences: this.settingsModel.emailBankReferences,
       emailTradeReferences: this.settingsModel.emailTradeReferences,
       themeID: this.settingsModel.themeID,
       formStyle: this.settingsModel.formStyle
    };
    this.settingsForm.reset(resetValue);

    this.closeSettings();
  }

  private closeSettings() {
    const div: HTMLElement = this.el.nativeElement.querySelector('.settings');
    div.className = 'animated fadeOutUp card card-accent-primary shadow-nohover settings';

    setTimeout(() => {
      this.focusService.showFocus = false;
      this.editSettingsMode = false;
      div.className = 'animated fadeInDown card card-accent-primary shadow-nohover settings';
    }, 750);
  }

  cancelKeyDown(evt, direction) {
    if (direction === 'forward') {
      if (evt.keyCode === 9 && !evt.shiftKey) {
        return false;
      }
    } else {
      if (evt.keyCode === 9 && evt.shiftKey) {
        return false;
      }
    }
  }

  private onDrag(value) {
    let bagname: string, el: HTMLElement, target: HTMLElement, source: HTMLElement, sibling: HTMLElement;
    [bagname, el, target, source, sibling] = value;

    if (bagname === 'section-bag') {
      // Update designer service changed flag.
      this.designerService.updateChangedStatus(true);
    }
  }

  private isDropDownListInUse(listName: string): boolean {

    let dropdownListInUse: boolean = false;

    function isItemUsingDropdownList(item: DesignerItem): boolean {
      if (item.items !== null && item.items !== undefined && item.items.length > 0) {
        for (let x = 0; x < item.items.length; x++) {
          if (isItemUsingDropdownList(item.items[x])) {
            return true;
          }
        }
      }

      if (item.listName === undefined) {
        return false;
      }

      if (item.listName === listName) {
        return true;
      }

      return false;
    }

    for (let x = 0; x < this.templateInstance.steps.length; x++) {
      for (let y = 0; y < this.templateInstance.steps[x].sections.length; y++) {
        for (let z = 0; z < this.templateInstance.steps[x].sections[y].items.length; z++) {
          dropdownListInUse = isItemUsingDropdownList(this.templateInstance.steps[x].sections[y].items[z]);
          if (dropdownListInUse) {
            return true;
          }
        }
      }
    }

    return dropdownListInUse;
  }

  private setSectionOrdinals(stepIndex: number) {
    this.templateInstance.steps[stepIndex].sections.map(section => {
      section.order = this.templateInstance.steps[stepIndex].sections.indexOf(section);
    });
  }

  private onDeleteSection(section: DesignerSection) {
    // Remove section items from designer fields.
    section.items.forEach((field) => this.designerService.removeField(field));

    // Remove from step sections.
    this.templateInstance.steps[0].sections = this.templateInstance.steps[0].sections.filter(item => item.id !== section.id);
  }

  private updateMappedFields() {
    this.templateInstance.steps[0].sections.forEach((section) => {
      section.items.forEach((item) => {
        // Only add mapped system fields. For now, hard coding these.
        if ((item.name === 'companyBusinessName')
          || (item.name === 'requestedAmount')
          || (item.name === 'companyCountry')) {
          item.isMappedField = true;
          item.isSystemField = true;
          item.isRequired = true;
        }

        if (!Util.isEmpty(item.items)) {
          item.items.forEach((childItem) => {
            // Only add mapped system fields. For now, hard coding these.
            if ((childItem.name === 'companyBusinessName')
              || (childItem.name === 'requestedAmount')
              || (childItem.name === 'companyCountry')) {
              childItem.isMappedField = true;
              item.isSystemField = true;
              childItem.isRequired = true;
            }
          });
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.dragulaService.destroy('section-bag');
    this.dragulaService.destroy('field-bag');

    this.designerService.removeAll();
  }

  canDeactivate(nextState: RouterStateSnapshot): boolean {
    this.nextState = nextState;

    // const templateChanged = this.designerService.getChangedStatus();

    // if (templateChanged) {
    if (this.formChanged) {
      this.modalRef = this.modalService.show(this.modalTemplate);
    }
    return !this.formChanged;
  }

  confirmSave() {
    this.modalRef.hide();
    this.saveTemplate();
  }

  declineSave() {
    this.modalRef.hide();

    // Reset designer service changed status.
    this.designerService.updateChangedStatus(false);

    // Continue where the user tried to go.
    this.router.navigateByUrl(this.nextState.url);
  }
}
