import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as NgFormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule as BsButtonsModule } from 'ngx-bootstrap/buttons';
import { DragulaModule } from 'ng2-dragula';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { AlertModule } from 'ngx-bootstrap';

// Import custom formly wrappers
import {
  FormlyWrapperCard,
  FormlyWrapperGroup,
  FormlyWrapperHorizontal,
  
} from '@creditpoint/forms';


import { FormsModule as CpxForms } from '@creditpoint/forms';

// Import custom formly types
import {
  FormlyFieldStatic,
  RepeatSectionComponent,
  FormlyGroupExtended,
  ButtonFieldComponent
} from '@creditpoint/forms';

/* Module Components */
import { AsideFieldsComponent } from './aside/aside-fields/aside-fields.component';
import { AsideFieldsetsComponent } from './aside/aside-fieldsets/aside-fieldsets.component';
import { AsideFieldTypesComponent } from './aside/aside-fieldtypes/aside-fieldtypes.component';
import { AsideHostComponent } from './aside/aside-host/aside-host.component';
import { DesignerTemplateTitleComponent } from './designer/designer-template-title/designer-template-title.component';
import { DesignerStepComponent } from './designer/designer-step/designer-step.component';
import { DesignerSectionComponent } from './designer/designer-section/designer-section.component';
import { DesignerItemComponent } from './designer/designer-item/designer-item.component';
import { DesignerFieldComponent } from './designer/designer-field/designer-field.component';
import { DesignerFieldsetComponent } from './designer/designer-fieldset/designer-fieldset.component';
import { DesignerSectionTitleComponent } from './designer/designer-section-title/designer-section-title.component';
import { FieldConfigCheckboxComponent } from './field-config/field-config-checkbox/field-config-checkbox.component';
import { FieldConfigDateComponent } from './field-config/field-config-date/field-config-date.component';
import { FieldConfigNumberComponent } from './field-config/field-config-number/field-config-number.component';
import { FieldConfigStringComponent } from './field-config/field-config-string/field-config-string.component';
import { FieldConfigStatictextComponent } from './field-config/field-config-statictext/field-config-statictext.component';
import { FieldConfigDropdownComponent } from './field-config/field-config-dropdown/field-config-dropdown.component';
import { FieldConfigFieldGroupComponent } from './field-config/field-config-field-group/field-config-field-group.component';
import { FieldConfigAttachmentComponent } from './field-config/field-config-attachment/field-config-attachment.component';
import { FieldConfiguratorComponent } from './field-config/field-configurator/field-configurator.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplatesListItemComponent } from './templates-list-item/templates-list-item.component';

/* Module Directives */
import { DynamicComponentDirective } from './shared/directives/dynamic-component.directive';

/* Module Services */
import { AsideService } from './shared/services/aside.service';
import { DesignerService } from './shared/services/designer.service';
import { TemplateService } from './shared/services/template.service';
import { DynamicTypeService } from './shared/services/dynamic-type.service';
import { TemplateResolver } from './shared/resolvers/template.resolver';
import { DropdownsResolver } from './shared/resolvers/dropdowns.resolver';
import { DropdownListService } from './shared/services/dropdown-list.service';
import { ThemeDataService } from '../shared/services/themes.service';

/* Module Routing */
import { TemplatesRoutingModule } from './templates-routing.module';
import { AsideDocumentsComponent } from './aside/aside-documents/aside-documents.component';
import { DocumentService } from '../shared/services/document.service';


export function minValidationMessage(err, field) {
  return `This value should be greater or equal to ${field.templateOptions.min}.`;
}

@NgModule({
  imports: [
    AlertModule.forRoot(),
    CommonModule,
    NgFormsModule,
    CpxForms,
    ReactiveFormsModule,
    GridModule,
    DropDownsModule,
    ButtonsModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    BsButtonsModule.forRoot(),
    DragulaModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
        { name: 'min', message: minValidationMessage },
        { name: 'fieldName', message: 'Field name is not unique for this template.' }
      ],
      types: [
        {name: 'button',component: ButtonFieldComponent},
      ],
    }),
    FormlyBootstrapModule,
    TemplatesRoutingModule
  ],
  declarations: [
    AsideFieldsComponent,
    AsideFieldsetsComponent,
    AsideFieldTypesComponent,
    AsideHostComponent,
    DesignerTemplateTitleComponent,
    DesignerStepComponent,
    DesignerSectionComponent,
    DesignerItemComponent,
    DesignerFieldComponent,
    DesignerFieldsetComponent,
    DesignerSectionTitleComponent,
    FieldConfigCheckboxComponent,
    FieldConfigDateComponent,
    FieldConfigNumberComponent,
    FieldConfigStringComponent,
    FieldConfigStatictextComponent,
    FieldConfigDropdownComponent,
    FieldConfigFieldGroupComponent,
    FieldConfigAttachmentComponent,
    FieldConfiguratorComponent,
    TemplatesListComponent,
    TemplatesListItemComponent,
    DynamicComponentDirective,
    AsideDocumentsComponent,
    FieldConfigAttachmentComponent
  ],
  providers: [
    BsModalService,
    AsideService,
    DesignerService,
    TemplateService,
    DynamicTypeService,
    TemplateResolver,
    DropdownsResolver,
    DropdownListService,
    ThemeDataService,
    DocumentService
  ],
  entryComponents: [
    AsideHostComponent,
    FieldConfigCheckboxComponent,
    FieldConfigNumberComponent,
    FieldConfigStringComponent,
    FieldConfigStatictextComponent,
    FieldConfigDateComponent,
    FieldConfigDropdownComponent,
    FieldConfigFieldGroupComponent,
    FieldConfigAttachmentComponent,
    DesignerFieldComponent,
    DesignerFieldsetComponent
  ]
})
export class TemplatesModule { }
