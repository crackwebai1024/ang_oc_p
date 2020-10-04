import {debounceTime} from 'rxjs/operators';
import { Component, ViewChild, OnInit, OnDestroy, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { Subscription, Observable } from 'rxjs';
import { SpaConfigService } from '@creditpoint/spa';
import { Util } from '@creditpoint/util';
import { SuccessEvent, SelectEvent, RemoveEvent } from '@progress/kendo-angular-upload';
import * as FileSaver from 'file-saver';

import {ThemeService } from '@creditpoint/spa/branding-services';

import { AppConfig } from '../../config';
import { TemplateMappingService } from '../../core/services/template-mapping.service';
import { FilesService } from '../../core/services/files.service';
import { FormsService } from '../shared/services/forms.service';
import { template } from './template';
import { _ } from '../../shared/lodash-extensions';
import { DesignerTemplate } from '../../templates/shared/models/designer-template';
import { DesignerFileUpload } from '../../templates/shared/models/designer-file-upload';
import { ClientSettingsService } from '@creditpoint/spa';
import { DataService } from '../../core/services/data.service';
import { Theme } from '../../shared/models/theme';
import { HttpHeaders } from '@angular/common/http';
import { IProgressOutlineItem, ProgressOutlineComponent } from '../../shared/components/progress-outline/progress-outline.component';
import { ScrollToService } from '@nicky-lenaers/ngx-scroll-to';
import { ConfirmationComponent } from '../confirmation/confirmation.component';
import { ToasterService } from 'angular2-toaster';
import { DesignerItemType } from '../../templates/shared/models/designer-item-type';
import { anyChanged } from '@progress/kendo-angular-common';
import { TabsetComponent, ModalDirective } from 'ngx-bootstrap';
import { FormStyleOption } from '../../templates/shared/models/form-style-option';
import { User } from '../../shared/models/user';
import { UserService } from '../../core/services/user.service';
import { RoleType } from '../../shared/models/role-type';

@Component({
  selector: 'cap-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {
  @ViewChild('kendoUploadInstance') kendoUploadInstance: any;
  @ViewChild('progressOutline') progressOutline: ProgressOutlineComponent;
  @ViewChild('sidebar') sidebar: ElementRef;
  @ViewChild('uploadErrorMessages') errorMessages: any;

  title: string = 'Application for Credit';
  templateName: string;
  uploadSaveUrl: string = null;
  uploadRemoveUrl: string = null;
  uploadSaveField: string = 'file';
  uploadRemoveField: string = 'fileName';
  uploadResponseType: string = 'text';
  uploadErrorMessage: string = null;
  uploadDisabled: boolean = false;
  uploadHidden: boolean = false;
  uploadWarningMessage: string = null;
  uploadInstructions: string = null;
  uploadMaxFiles: number = 0;
  requiredFiles: any[] = null;
  invalidFileFields: any[] = [];
  formLoaded: boolean = false;
  defaultTemplateId: string = '5ad7aa51c07f7240540ed839';
  templateJSON: string = template;
  creditAppTemplate: DesignerTemplate;
  form: FormArray = new FormArray([]);
  model: any;
  options: FormlyFormOptions[] = [];
  fields: FormlyFieldConfig[];
  newCreditApp: boolean = true;
  creditAppID: string;
  templateID: string;
  autoSaveSubscription: Subscription;
  lastSaved: Date;
  innerDocClick: boolean;
  signature: string;
  isSubmitted: boolean = false;
  theme: Theme;
  formOutline: IProgressOutlineItem;
  sectionsToSpy: string[];
  selectedSection: string;
  fileSaveEvent: Subscription;
  fileDeleteEvent: Subscription;
  fileSaveFailEvent: Subscription;
  renderTimer: any;
  renderComplete: boolean;
  scrollWindow: HTMLCollectionOf<Element>;
  isExisting: boolean = false;

  isWizardForm:boolean;

  user: User;
  disableSubmit:boolean = false;
  isClientAdmin:boolean = false;
  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  constructor(
    private filesService: FilesService,
    private formsService: FormsService,
    private templateMappingService: TemplateMappingService,
    private route: ActivatedRoute,
    private router: Router,
    private configService: SpaConfigService,
    private themeService: ThemeService,
    private dataService: DataService,
    private scrollToService: ScrollToService,
    private renderer: Renderer2,
    private toaster: ToasterService,
    private userService: UserService) {
    this.renderComplete = false;

    if (route.snapshot.params.id) {
      this.creditAppID = route.snapshot.params.id;
      sessionStorage.setItem('creditAppID', this.creditAppID);
    }

    if (sessionStorage.getItem('creditAppID') !== null && Util.isEmpty(this.creditAppID)) {
      this.creditAppID = sessionStorage.getItem('creditAppID');
    }

    if (Util.isEmpty(this.creditAppID) && (sessionStorage.getItem('template-id') !== null)) {
      this.templateID = sessionStorage.getItem('template-id');
    }

    if (Util.isEmpty(this.creditAppID) && Util.isEmpty(this.templateID)) {
      router.navigate(['/']);
    }

    sessionStorage.removeItem('template-id');

    this.fileSaveEvent = this.formsService.fileSaveEvent$.subscribe($event => {
      if ($event.file !== undefined) {
        this.onFileSave($event);
      }
    });

    this.fileDeleteEvent = this.formsService.fileDeleteEvent$.subscribe($event => {
      if ($event !== undefined) {
        this.onFileDelete($event);
      }
    });

    this.fileSaveFailEvent = this.formsService.fileSaveFailEvent$.subscribe($event => {
      if ($event !== undefined) {
        this.onFileSaveFailed($event);
      }
    });
  }

  ngOnInit(): void {
    this.loadUser();
    this.angularBootstrapFix(0);
    this.uploadSaveUrl = this.filesService.getFileUploadEndpoint();
    this.uploadRemoveUrl = this.filesService.getFileDeletionEndpoint();
    this.scrollWindow = document.getElementsByClassName('app-body');
    if (!Util.isEmpty(this.creditAppID)) {
      this.isExisting = true;
      this.loadExistingCreditApp();
    } else {
      this.isExisting = false;
      this.loadNewCreditApp();
    }
  }

  ngOnDestroy(): void {
    if (localStorage.getItem('capBusiness') !== null) {
      localStorage.removeItem('capBusiness');
    }
    if (this.fileSaveEvent !== undefined) {
      this.fileSaveEvent.unsubscribe();
    }

    if (this.fileDeleteEvent !== undefined) {
      this.fileDeleteEvent.unsubscribe();
    }

    if (this.fileSaveFailEvent !== undefined) {
      this.fileSaveFailEvent.unsubscribe();
    }
  }

  angularBootstrapFix(counter: number) {
    if (counter < 12) {
      setTimeout(() => {
        // BUG FIX: ngx-bootstrap adds tooltip to the top of the page if you click on a link with a tooltip before the tooltip is initialized;
        const element = document.getElementsByClassName('tooltip')[0];
        if (element !== undefined && element.parentNode !== undefined) {
          element.parentNode.removeChild(element);

        } else {
          this.angularBootstrapFix(counter + 1);
        }
      }, 250);
    }
  }

  loadTheme(theme: Theme) {
      this.themeService.preview(theme);
  }

  loadExistingCreditApp() {
    this.formsService.getCreditApp(this.creditAppID)
      .subscribe({
        next: tpl => {
          this.formLoaded = true;
          this.newCreditApp = false;
          if (typeof tpl === 'string') {
            this.creditAppTemplate = JSON.parse(tpl);
          } else {
            this.creditAppTemplate = tpl;
          }

          if (tpl.theme !== undefined) {
            this.theme = tpl.theme;
            if (this.theme.logoFileName != null) {
              this.getImage(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`)).subscribe(logoData => {
                this.createImageFromBlob(logoData);
              });
            } else {
              if (localStorage.getItem('theme') !== null) {
                this.themeService.preview(JSON.parse(localStorage.getItem('theme')));
              }
            }
          }

          const signatureData: any = (this.creditAppTemplate.steps[0].sections[0].items.filter(x => {
            if (x === null) {
              return false;
            }
            return x.name === 'signature';
          })[0] || { value: '_______________________________'});

          this.signature = signatureData.value;

          this.creditAppTemplate.steps[0].sections[0].items = this.creditAppTemplate.steps[0].sections[0].items.filter(x => {
            if (x === null) {
              return false;
            }
            return x.name !== 'signature';
          });

          this.hydrateTemplate();

          this.templateName = this.creditAppTemplate.templateName;
          this.uploadInstructions = this.creditAppTemplate.fileUpload.instructions;
          this.uploadMaxFiles = this.creditAppTemplate.fileUpload.maximumFiles;

          const transformedTemplate = this.templateMappingService.transformTemplate(this.creditAppTemplate, !this.isClientAdmin && tpl.status.toLowerCase() !== 'unsubmitted', false)[0];
          this.fields = transformedTemplate[0].fieldGroup;
          this.isWizardForm = this.creditAppTemplate.formStyle === FormStyleOption.Wizard;

          if(this.isWizardForm){
            this.fields = [{
              type: 'tabs',
              fieldGroup: this.fields
            }];
          }

          this.requiredFiles = transformedTemplate.requiredFiles;
          this.model = this.templateMappingService.generateModels(this.creditAppTemplate, false)[0];
          this.model.systemFields = this.creditAppTemplate.systemFields;
          this.form.markAsPristine();
          this.isSubmitted = this.creditAppTemplate.status.toLowerCase() !== 'unsubmitted';

          this.buildNavigationOutline();

          // For existing credit apps, let's give auto save a few seconds to kick in AFTER we hydrate the form.
          this.configService.overlay = true;
          const originalOverlayMessage: string = this.configService.overlayMessage;
          this.configService.overlayMessage = 'Populating credit application...';
          setTimeout(() => {
            try {
              // Auto save only applies to unsubmitted credit apps. All other statuses are read-only.
              if (!this.isSubmitted) {
                this.resumeExistingFormEditing(this.form);
                this.startAutoSave();
                this.form.updateValueAndValidity({ onlySelf: false, emitEvent: true });
              }
            } finally {
              this.configService.overlay = false;
              this.configService.overlayMessage = originalOverlayMessage;
            }
          }, 3000);
        }
      });
  }

  loadNewCreditApp() {
    this.formsService.getNewCreditApp(this.templateID)
      .subscribe({
        next: tpl => {
          // For new credit apps, let's start auto save right away before we hydrate the form.
          // this.startAutoSave();

          this.formLoaded = true;
          this.creditAppTemplate = tpl;
          this.hydrateTemplate();

          this.templateName = this.creditAppTemplate.templateName;
          this.uploadInstructions = this.creditAppTemplate.fileUpload.instructions;
          this.uploadMaxFiles = this.creditAppTemplate.fileUpload.maximumFiles;

          const transformedTemplate = this.templateMappingService.transformTemplate(this.creditAppTemplate, false, false)[0];
          this.fields = transformedTemplate[0].fieldGroup;
          this.isWizardForm = this.creditAppTemplate.formStyle === FormStyleOption.Wizard;
        
          if(this.isWizardForm){
            this.fields = [{
              type: 'tabs',
              fieldGroup: this.fields
            }];
          }
          this.requiredFiles = transformedTemplate.requiredFiles;
          this.model = this.templateMappingService.generateModels(this.creditAppTemplate, true)[0];

          this.buildNavigationOutline();

          // For new credit apps, let's start auto save right away before we hydrate the form.
          this.startAutoSave();
        }
      });
  }

  // Technical debt case CA-546 has been created to find a better solution.
  termsAndConditionsFix() {
    const termsElements = document.getElementsByClassName('terms-conditions');
    for (let i = 0; i < termsElements.length; i++) {
      if (termsElements[i].getElementsByTagName('textarea')[0].value === '') {
        termsElements[i].getElementsByTagName('textarea')[0].value = termsElements[i].getElementsByTagName('textarea')[0].placeholder;
      }
    }
  }

  hydrateTemplate() {
    this.creditAppTemplate.fileUpload = this.creditAppTemplate.fileUpload || new DesignerFileUpload(0, 0, null);
    this.creditAppTemplate.fileUpload.files = this.creditAppTemplate.fileUpload.files || [];
  }

  buildNavigationOutline() {
    // We could combine this and the flattening into
    // a single method -- probably will in the future.
    const outlineItemMapper = function(templateItem: any): IProgressOutlineItem {
      const progressOutlineItem: IProgressOutlineItem = {
        label: templateItem.displayName,
        anchor: templateItem.id,
        isRoot: false,
        children: null,
        isStep: templateItem.hasOwnProperty('sections'),
        isValid: true
      };

      if (templateItem.hasOwnProperty('steps') && templateItem.steps.length > 0) {
        progressOutlineItem.children = templateItem.steps.map(outlineItemMapper);
      } else if (templateItem.hasOwnProperty('sections') && templateItem.sections.length > 0) {
        progressOutlineItem.children = templateItem.sections.map(outlineItemMapper);
      }

      return progressOutlineItem;
    };

    const scrollSpySectionMapper = function(templateItem: any) {
      if (templateItem.children) {
        for (let i = 0; i < templateItem.children.length; i++) {
          return templateItem.children.map(scrollSpySectionMapper);
        }
      }
      return templateItem.anchor;
    };

    const flat = function(sourceArray: any) {
      let flattenedArray = [];
      for (let i = 0; i < sourceArray.length; i++) {
          if (Array.isArray(sourceArray[i])) {
            flattenedArray = flattenedArray.concat(flat(sourceArray[i]));
          } else {
            flattenedArray.push(sourceArray[i]);
          }
      }
      return flattenedArray;
    };

    this.formOutline = {
      label: 'Application',
      anchor: 'top',
      isRoot: true,
      children: this.creditAppTemplate.steps.map(outlineItemMapper),
      isStep: false,
      isValid: true
    };

    this.sectionsToSpy = flat(this.formOutline.children.map(scrollSpySectionMapper));
    this.sectionsToSpy.push('top');

    this.progressOutline.selectedAnchor = 'top';
  }

  onSectionChange(section: any) {
    if(!this.isWizardForm){
      if (section.id.toLowerCase() === 'top') {
        this.renderer.setStyle(
          this.sidebar.nativeElement,
          'top',
          '80px'
        );
      } else {
        this.renderer.setStyle(
          this.sidebar.nativeElement,
          'top',
          (this.scrollWindow[0].scrollTop - 100) + 'px'
        );
      }
  
      if (this.progressOutline.manualSelection) {
        return;
      }
  
      if (this.progressOutline.selectedAnchor !== section.id) {
        this.progressOutline.selectedAnchor = section.id;
      }
    }
  }

  startAutoSave() {
    this.autoSaveSubscription = this.form.valueChanges.pipe(
      debounceTime(1000))
      .subscribe({
        next: formData => {
          this.saveCreditApp();
        }
      });
  }

  saveCreditApp() {
    if (this.newCreditApp) {
      const creditApp = this.templateMappingService.exportModel(this.model, this.creditAppTemplate);
      this.addCreditApp(creditApp);
    } else {
      const creditApp = this.templateMappingService.exportModel(this.model, this.creditAppTemplate);
      creditApp.id = this.creditAppID;
      this.updateCreditApp(this.creditAppID, creditApp);
    }
    this.termsAndConditionsFix();
  }

  stopAutoSave() {
    if (this.autoSaveSubscription) {
      this.autoSaveSubscription.unsubscribe();
    }
  }

  resumeExistingFormEditing(form: any) {
    this.setControlStateIndicators(form);
    this.scrollToFirstIncompleteSection(form);
  }

  setControlStateIndicators(control: any) {
    const findFormOutlineItem = function(formOutlineItem: IProgressOutlineItem, anchor: string) {
      if (formOutlineItem.anchor === anchor) {
        return formOutlineItem;
      }
      if (formOutlineItem.children && formOutlineItem.children.length > 0) {
        for (let i = 0; i < formOutlineItem.children.length; i++) {
          const result = findFormOutlineItem(formOutlineItem.children[i], anchor);
          if (result) {
            return result;
          }
        }
      }
      return;
    };

    let childControl: any = null;
    if (control.controls) {
      Object.keys(control.controls).forEach(childKey => {
        childControl = control.get(childKey);
        if ((this.invalidFileFields.map(x => x.parentSection).indexOf(childKey) !== -1)) {
          const formOutlineItem: IProgressOutlineItem = findFormOutlineItem(this.formOutline, childKey);
          if (formOutlineItem) {
            formOutlineItem.isValid = false;
          }
        }

        if (!childControl.valid) {
          const formOutlineItem: IProgressOutlineItem = findFormOutlineItem(this.formOutline, childKey);
          if (formOutlineItem) {
            formOutlineItem.isValid = false;
          }
          if (childControl.markAsTouched) {
            childControl.markAsTouched();
          }
        }
        this.setControlStateIndicators(childControl);
      });
    }
  }

  scrollToFirstIncompleteSection(form: any) {
    let childControl: any = null;
    Object.keys(form.controls).forEach(childKey => {
      childControl = form.get(childKey);
      if (!childControl.valid) {
        this.scrollToService.scrollTo({
          target: childKey
        });
        return;
      }
    });
  }

  validForm(): boolean {
    let isValid = true;
    if (this.requiredFiles !== null && this.requiredFiles.length > 0) {
        const uploadedFilesTypes = this.creditAppTemplate.fileUpload.files.map(x => x.fileType);
        this.invalidFileFields = this.requiredFiles.filter(type =>
          uploadedFilesTypes.indexOf(type.docType) === -1);
    }

    if (!this.form.valid || this.invalidFileFields.length > 0) {
      isValid = false;
    }

    return isValid;
  }

  onFileSave(event: any) {
    event.file.contentType = event.event.files[0].rawFile.type;
    this.creditAppTemplate.fileUpload.files.push(event.file);
    this.saveCreditApp();
  }

  onFileDelete(event: any) {
    this.creditAppTemplate.fileUpload.files = this.creditAppTemplate.fileUpload.files.filter(file => {
      return (((event.files[0].uid.indexOf('.') === -1) ? file.uid : file.internalFileName) !== event.files[0].uid);
    });
    this.saveCreditApp();
  }

  onFileSaveFailed(evt: any) {
    if (evt.response.error.toLowerCase() === 'invalid file type') {
      this.uploadErrorMessage = 'Invalid file type detected.';
    } else {
      this.uploadErrorMessage = 'An error has occurred. Please wait a moment and try again.';
    }
  }

  downloadPdf(evt: MouseEvent) {
    this.configService.overlayMessage = 'Downloading credit application. Please wait...';
    this.configService.overlay = true;
    this.formsService.downloadCreditAppPDF(this.creditAppID, this.creditAppTemplate.status.toLowerCase() !== 'unsubmitted')
    .subscribe(
      data => {
        FileSaver.saveAs(data, this.creditAppTemplate.templateName + '.pdf');
        this.configService.overlay = false;
      },
      error => {
        this.configService.overlay = false;
      }
    );
  }

  applyFileDownloadIcon(fileDownloadActionButton: any, action: string) {
    if (action === 'downloading') {
      fileDownloadActionButton.classList.remove('fa');
      fileDownloadActionButton.classList.remove('fa-download');

      fileDownloadActionButton.classList.add('fa');
      fileDownloadActionButton.classList.add('fa-spinner');
      fileDownloadActionButton.classList.add('fa-pulse');
      fileDownloadActionButton.title = 'Downloading...';
    } else {
      fileDownloadActionButton.classList.remove('fa');
      fileDownloadActionButton.classList.remove('fa-spinner');
      fileDownloadActionButton.classList.remove('fa-pulse');

      fileDownloadActionButton.classList.add('fa');
      fileDownloadActionButton.classList.add('fa-download');
      fileDownloadActionButton.title = 'Download';
    }
  }

  onFileRemove(evt: RemoveEvent) {
    evt.files.forEach(file => {
      file.name = this.creditAppTemplate.fileUpload.files.find(creditAppFile => {
        return creditAppFile.publicFileName === file.name;
      }).internalFileName;
    });
  }

  updateCreditApp(creditAppID: string, creditApp: any) {
    this.creditAppID = creditAppID;
    this.formsService.updateCreditApp(creditAppID, creditApp)
      .subscribe({
        next: data => {
          this.lastSaved = new Date();
          if (this.isExisting) {
            this.formOutline.children[0].children.forEach(x => x.isValid = true);
            this.setControlStateIndicators(this.form);
            this.formsService.checkAttachments((this.creditAppTemplate.fileUpload.files || []));
          }
        }
      });
  }

  addCreditApp(creditApp: any) {
    this.formsService.addCreditApp(creditApp)
      .subscribe({
        next: data => {
          this.newCreditApp = false;
          this.creditAppID = data.id;
          this.lastSaved = new Date();

          // Put creditAppID in session storage to prevent refresh duplication.
          sessionStorage.setItem('creditAppID', this.creditAppID);
        }
      });
  }

  canDeactivate(nextState: RouterStateSnapshot): boolean {
    if ((nextState.url.indexOf('form-new') === -1) && (nextState.url.indexOf('business-search') === -1)) {
      sessionStorage.removeItem('creditAppID');
    }
    return true;
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.theme.logo = `url(${(<string>reader.result)})`;
      this.themeService.preview(this.theme);

      this.loadTheme(this.theme);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getImage(imgUrl: string): Observable<Blob> {
  const httpOptions = {
    headers: new HttpHeaders({
      'responseType': 'blob'
    })};

  return  this.dataService.get(imgUrl, { 'responseType': 'blob' });
  }

  submit() {
    this.isExisting = true;
    this.validForm();
    this.resumeExistingFormEditing(this.form);
    this.formsService.checkAttachments(this.creditAppTemplate.fileUpload.files || []);
    if (this.validForm()) {
      this.appendMissingFields()
      .subscribe({
        next: (data) => {
          this.configService.overlay = true;
          this.configService.overlayMessage = 'Credit application is being submitted. Please wait...';
          this.formsService.submitCreditApp(this.creditAppID)
            .subscribe({
              next: submitResult => {
                  this.configService.overlay = false;
                  if(this.isClientAdmin){
                    this.toaster.pop('success', 'Updated', 'The credit application has been updated.');
                    this.router.navigate(['/creditapps']);
                  }else{
                    this.toaster.pop('success', 'Submitted', 'The credit application has been submitted.');
                    this.router.navigate(['/list']);
                  }
                  
                },
                error: err => {
                  this.configService.overlay = false;
                  if(this.isClientAdmin){
                    this.toaster.pop('success', 'Updation Failed', 'The credit application failed to update.');
                    this.router.navigate(['/creditapps']);
                  }else{
                    this.toaster.pop('error', 'Submission Failed', 'The credit application failed to submit.');
                    this.router.navigate(['/list']);
                  }
                }
            });
        }
      });
    }
  }


  appendMissingFields() {
    return new Observable(obs => {
      this.configService.overlay = true;
      this.configService.overlayMessage = 'Processing, please wait...';
      this.creditAppTemplate.systemFields.forEach(systemField => {
        if (!this.isSystemFieldPresentInCreditApp(systemField.name)) {
          systemField.cssClass = 'd-none';
          this.creditAppTemplate.steps[0].sections[0].items.push(systemField);
        }
      });

      this.formsService.updateCreditApp(this.creditAppTemplate.id, this.creditAppTemplate)
        .subscribe({
          next: updateResult => {
            this.configService.overlay = false;
            obs.next(updateResult);
          }
        });
    });
  }

  private isSystemFieldPresentInCreditApp(fieldName: string): boolean {
    for (let x = 0; x < this.creditAppTemplate.steps.length; x++) {
      for (let y = 0; y < this.creditAppTemplate.steps[x].sections.length; y++) {
        for (let z = 0; z < this.creditAppTemplate.steps[x].sections[y].items.length; z++) {
          const item = this.creditAppTemplate.steps[x].sections[y].items[z];
          if (item.name === fieldName) {
            return true;
          } else if (item.items !== undefined && item.items !== null && item.items.length > 0) {
            for (let i = 0; i < item.items.length; i++) {
              const childItem = item.items[i];
              if (childItem.name === fieldName) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  loadUser(){
    this.userService.getCurrentUser().subscribe(data => {
      this.user = data;
      if(this.user.roles.includes(RoleType.Demo)){
        this.disableSubmit = true;
      }else if(this.user.roles.includes(RoleType.ClientAdmin)){
        this.isClientAdmin = true;
      }
    })
  }

  isValid(field: FormlyFieldConfig) {
    if (field.key) {
      return field.formControl.valid;
    }
    return field.fieldGroup.every(f => this.isValid(f));
  }
}
