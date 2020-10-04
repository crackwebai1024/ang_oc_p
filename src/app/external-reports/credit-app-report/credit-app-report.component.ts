import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { GridDataResult, SelectableSettings, PageChangeEvent } from '@progress/kendo-angular-grid';
import { UploadModule, SuccessEvent, SelectEvent, ErrorEvent, UploadComponent, CustomMessagesComponent, UploadEvent } from '@progress/kendo-angular-upload';
import { Util } from '@creditpoint/util';
import { isString } from 'util';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';

import { ExternalReportsService } from '../shared/services/external-reports.service';
import { TemplateMappingService } from '../../core/services/template-mapping.service';
import { FilesService } from '../../core/services/files.service';
import { DesignerFileUpload } from '../../templates/shared/models/designer-file-upload';
import { ClientSettings, ClientSettingsService } from '@creditpoint/spa';
import { Theme } from '../../shared/models/theme';
import { ThemeDataService } from '../../shared/services/themes.service';
import { ThemeService } from '@creditpoint/spa/branding-services';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../../core/services/data.service';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap';
import { FormStyleOption } from '../../templates/shared/models/form-style-option';

@Component({
  selector: 'credit-app-report',
  templateUrl: './credit-app-report.component.html',
  styleUrls: ['./credit-app-report.component.scss']
})
export class CreditAppReportComponent implements AfterViewInit {
  @ViewChild('kendoUploadInstance') kendoUploadInstance: any;

  uploadSaveUrl: string = '';
  uploadRemoveUrl: string = 'removeUrl';
  uploadResponseType: string = 'text';
  uploadMaxFiles: number = 0;

  creditAppTemplate: any;
  termsConditions: string;
  form: FormArray = new FormArray([]);
  model: any;
  options: FormlyFormOptions[] = [];
  fields: FormlyFieldConfig[];
  gridView: GridDataResult;
  formID: string = null;
  formLoaded: boolean = false;
  logoLoaded: boolean = false;
  isNewCreditApp: boolean = false;
  hideBlankFields: boolean = false;
  isPreview: boolean = false;
  clientSettings: ClientSettings;
  creditAppStatus: string;
  docuSignEnvelopeID: string;
  isCore: boolean = false;
  showContent: boolean = false;
  signature: string;
  theme: Theme;
  logoSrc: string;
  logoAlignment: string = 'left';
  submittedDate: Date;

  steps: FormlyFieldConfig[] = [];
  isWizardForm:boolean;
  activedStep = 0;

  @ViewChild('staticTabs') staticTabs: TabsetComponent;

  constructor(
    private reportsService: ExternalReportsService,
    private templateMappingService: TemplateMappingService,
    private filesService: FilesService,
    private clientSettingsService: ClientSettingsService,
    private route: ActivatedRoute,
    private themeDataService: ThemeDataService,
    private themeService: ThemeService,
    private dataService: DataService) {

    this.creditAppTemplate = {};
    if (route.snapshot.params.id) {
      this.formID = route.snapshot.params.id;
    }

    if (localStorage.getItem('theme') !== null) {
      this.theme = JSON.parse(localStorage.getItem('theme'));
      this.themeService.preview(this.theme);
      this.logoSrc = this.theme.logo.replace('url(', '').replace(')', '');
    }

    if (route.snapshot.params.isCore) {
      this.isCore = route.snapshot.params.isCore;
    }

    if (route.snapshot.url.filter(urlSegment => {
      return urlSegment.path.toLowerCase() === 'new';
    }).length > 0) {
      this.isNewCreditApp = true;
    }

    if (!Util.isEmpty(route.snapshot.params.hideBlankFields)) {
      this.hideBlankFields = route.snapshot.params.hideBlankFields.toLowerCase() === 'true' ? true : false;
    }

    if (!Util.isEmpty(route.snapshot.params.isPreview)) {
      this.isPreview = route.snapshot.params.isPreview.toLowerCase() === 'true' ? true : false;
    }

    this.clientSettings = this.clientSettingsService.clientSettings;
  }

  ngAfterViewInit() {
    document.getElementById('background-print').outerHTML = '';
    this.loadCreditApp();

    // Once credit app has been loaded, render terms and conditions and download button components(adding delay time)
    setTimeout(() => this.showContent = true, 2000);
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.theme.logo = `url(${(<string>reader.result)})`;
      this.themeService.preview(this.theme);
      this.logoSrc = <string>reader.result;
      this.logoLoaded = true;
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

  loadCreditApp() {
    let creditAppObservable: Observable<any> = null;

    if (this.isNewCreditApp) {
      creditAppObservable = this.reportsService.getNewCreditApp(this.formID);
    } else {
      creditAppObservable = this.reportsService.getCreditApp(this.formID);
    }

    creditAppObservable
      .subscribe({
        next: tpl => {
          this.formLoaded = true;
          this.creditAppStatus = tpl.status.toLowerCase();
          this.docuSignEnvelopeID = tpl.docuSignEnvelopeID;
          if (typeof tpl === 'string') {
            this.creditAppTemplate = JSON.parse(tpl);
          } else {
            this.creditAppTemplate = tpl;
          }

          if (this.creditAppTemplate.status.toLowerCase() === 'submitted') {
            this.submittedDate = this.creditAppTemplate.submittedDate;
          }

          this.theme = this.creditAppTemplate.theme;

          if (this.creditAppTemplate.theme.logoAlignment) {
            this.logoAlignment = this.creditAppTemplate.theme.logoAlignment.split(' ')[0];
          }

          if (this.theme.logoFileName != null) {
            this.getImage(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`)).subscribe(logoData => {
              this.createImageFromBlob(logoData);
            });
          }

          this.signature = (this.creditAppTemplate.steps[0].sections[0].items.filter(x => {
            return x.name === 'signature';
          })[0] || {}).value;

          this.creditAppTemplate.steps[0].sections[0].items = this.creditAppTemplate.steps[0].sections[0].items.filter(x => {
            return x.name !== 'signature';
          });

          this.hydrateTemplate();
          this.uploadMaxFiles = this.creditAppTemplate.fileUpload.maximumFiles;
          this.isWizardForm = this.creditAppTemplate.formStyle === FormStyleOption.Wizard;
          this.fields = this.templateMappingService.transformTemplate(this.creditAppTemplate, true, false)[0][0].fieldGroup;
          this.model = this.templateMappingService.generateModels(this.creditAppTemplate, false)[0];
          this.steps = this.fields;
          this.form = new FormArray(this.steps.map(() => new FormGroup({})));
          this.options = this.steps.map(() => <FormlyFormOptions> {});
          this.termsAndConditionsFix();
        }
      });
  }

  // Technical debt case CA-546 has been created to find a better solution.
  termsAndConditionsFix() {
    const formSet = document.getElementsByTagName('formly-field');
    const termsElements = document.getElementsByClassName('terms-conditions');
    if (formSet.length === 0) {
      setTimeout(() => {
        this.termsAndConditionsFix();
      }, (10));
    } else {
      for (let i = 0; i < termsElements.length; i++) {
        if (termsElements[i].getElementsByTagName('textarea')[0].value === '') {
          const height =  `${termsElements[i].getElementsByTagName('textarea')[0].scrollHeight + 25}px`;
          termsElements[i].getElementsByTagName('textarea')[0].style.height = height;
          termsElements[i].getElementsByTagName('textarea')[0].value = termsElements[i].getElementsByTagName('textarea')[0].placeholder;
        }
      }
    }
  }

  hydrateTemplate() {
    this.creditAppTemplate.fileUpload = this.creditAppTemplate.fileUpload || new DesignerFileUpload(0, 0, null);
    this.creditAppTemplate.fileUpload.files = this.creditAppTemplate.fileUpload.files || [];
  }

  downloadFile(fileDownloadActionButton: any, fileName: string, friendlyName: string) {
    this.applyFileDownloadIcon(fileDownloadActionButton, 'downloading');
    this.filesService.downloadFile(fileName, friendlyName)
      .subscribe(
        data => {
          FileSaver.saveAs(data, friendlyName);
          this.applyFileDownloadIcon(fileDownloadActionButton, 'download');
        },
        error => {
          console.log(error);
          this.applyFileDownloadIcon(fileDownloadActionButton, 'download');
        }
      );
    return false;
  }

  downloadSignaturePdf(event) {
    const clientID = localStorage.getItem('clientId');
    this.reportsService.downloadDocument(this.formID).subscribe(
      data => {
        this.applyFileDownloadIcon(event.target, 'download');
        FileSaver.saveAs(data,  '.pdf');
      },
      error => {
        this.applyFileDownloadIcon(event.target, 'download');
      }
    );
  }

  hiddenStatus() {
    if (this.clientSettings.useDocusign && this.creditAppStatus !== 'incomplete' && this.isCore && this.docuSignEnvelopeID !== null) {
      return false;
    } else {
      return true;
    }
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

  prevStep() {
    if (this.activedStep==0)
        return;
    this.activedStep--;
    this.selectActiveStep();
  }

  nextStep() {
    if (this.activedStep == this.steps.length-1){
        return true;
    }      
    this.activedStep++;  
    this.selectActiveStep();
  }

  selectActiveStep(){
    this.staticTabs.tabs[this.activedStep].disabled  = false;
    this.staticTabs.tabs[this.activedStep].active = true;
  }
  
  
  public get isLast() : boolean {
    return this.steps.length - 1 == this.activedStep;
  }

  public get isFirst() : boolean {
    return this.activedStep == 0;
  }

  onSelect(stepIndex: number): void {
    this.activedStep = stepIndex;
    this.selectActiveStep();
  }
}
