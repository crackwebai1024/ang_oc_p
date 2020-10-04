
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CreditAppService } from '../../services';
import { CreditAppSummary } from '../../../forms/shared/models/credit-app-summary';
import { ActivatedRoute } from '@angular/router';
import { DesignerTemplate } from '../../../templates/shared/models/designer-template';
import { Theme } from '../../../shared/models/theme';
import { ThemeService } from '@creditpoint/spa/branding-services';
import { FormArray, FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormStyleOption } from '../../../templates/shared/models/form-style-option';
import { TemplateMappingService } from '../../../core/services/template-mapping.service';

@Component({
  selector: 'creditapp-detail',
  templateUrl: 'creditapp-detail.component.html',
  styleUrls: ['creditapp-detail.component.css']
})
export class CreditAppDetailComponent implements OnInit {
 
  title = 'Credit Applications';
  creditAppID: string;
  creditAppTemplate: DesignerTemplate;
  
  templateName: string;
  form: FormArray = new FormArray([]);
  model: any;
  options: FormlyFormOptions[] = [];
  fields: FormlyFieldConfig[];
  formLoaded: boolean = false;

  steps: FormlyFieldConfig[] = [];
  isWizardForm:boolean;
  activedStep = 0;
  
  constructor(
    private creditAppService:CreditAppService,
    private route: ActivatedRoute,
    private templateMappingService: TemplateMappingService,
    private themeService: ThemeService) { 
      this.creditAppID = route.snapshot.params.id;
  }

  ngOnInit() {
    this.loadCreditApp();
  }

  loadCreditApp(){
    this.creditAppService.getCreditApp(this.creditAppID)
    .subscribe({
      next: tpl => {
        this.formLoaded = true;
        if (typeof tpl === 'string') {
          this.creditAppTemplate = JSON.parse(tpl);
        } else {
          this.creditAppTemplate = tpl;
        }

        this.templateName = this.creditAppTemplate.templateName;

        this.fields = this.templateMappingService.transformTemplate(this.creditAppTemplate, true, false)[0][0].fieldGroup;
        this.isWizardForm = this.creditAppTemplate.formStyle === FormStyleOption.Wizard;
        this.steps = this.fields;
        this.form = new FormArray(this.steps.map(() => new FormGroup({})));
        
        this.options = this.steps.map(() => <FormlyFormOptions> {});
        this.model = this.templateMappingService.generateModels(this.creditAppTemplate, false)[0];
      }})
  }
}
