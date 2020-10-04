import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule as NgFormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { FormsModule as CPSFormsModule } from '@creditpoint/forms';

// Import 3rd party modules and components
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { UploadModule } from '@progress/kendo-angular-upload';
import { NgSpinKitModule } from 'ng-spin-kit';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// Import custom formly wrappers
import {
  FormlyWrapperCard,
  FormlyWrapperGroup,
  FormlyWrapperHorizontal
} from '@creditpoint/forms';

// Import custom formly types
import {
  FormlyFieldStatic,
  RepeatSectionComponent,
  FormlyGroupExtended,
  TermConditionsComponent
} from '@creditpoint/forms';

import { FormComponent } from './form/form.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';

import { FormsService } from './shared/services/forms.service';
import { AsideService } from '../templates/shared/services/aside.service';

import { FormsRoutingModule } from './forms.routing';
import { FormListComponent } from './form-list/form-list.component';
import { FormListItemComponent } from './form-list-item/form-list-item.component';

import { CreditAppResolver } from './shared/resolvers/credit-app.resolver';
import { SystemFieldsResolver } from './shared/resolvers/system-fields.resolver';
import { SpecificFileUploadComponent } from './specific-file-upload/specific-file-upload.component';
import { FormNewComponent } from './form-new/form-new.component';
import { ButtonWrapperComponent } from './shared/formly-components/button-wrapper.component';
import { ThemeDataService } from '../shared/services/themes.service';
import { AttachmentWrapperComponent } from './shared/formly-components/attachment.component';
import {MatTabsModule} from '@angular/material/tabs';
import { SharedModule } from '../shared/shared.module';
import { TabsModule, ModalModule } from 'ngx-bootstrap';
import {FormlyTabsModule} from 'ngx-formly-tabs';
import { FormlyFieldTabs } from './shared/formly-components/tabs.type';

@NgModule({
  imports: [
    CommonModule,
    NgFormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'card', component: FormlyWrapperCard },
        { name: 'group', component: FormlyWrapperGroup },
        { name: 'field-horizontal', component: FormlyWrapperHorizontal },
        { name: 'creditsafe', component: ButtonWrapperComponent },
        { name: 'attachment', component: AttachmentWrapperComponent }
      ],
      types: [
        { name: 'static', component: FormlyFieldStatic },
        { name: 'repeat', component: RepeatSectionComponent },
        { name: 'terms-conditions', component: TermConditionsComponent },
        { name: 'tabs', component: FormlyFieldTabs },
      ],
      validators: [
        { name: 'requiredTrue', validation: Validators.requiredTrue },
      ]
    }),
    SharedModule,
    MatTabsModule,
    FormlyBootstrapModule,
    CPSFormsModule,
    GridModule,
    ButtonsModule,
    NgSpinKitModule,
    AlertModule.forRoot(),
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    FormsRoutingModule,
    UploadModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormlyTabsModule
  ],
  declarations: [
    FormComponent,
    ConfirmationComponent,
    FormListComponent,
    FormListItemComponent,
    SpecificFileUploadComponent,
    FormNewComponent,
    ButtonWrapperComponent,
    AttachmentWrapperComponent,
    FormlyFieldTabs 
  ],
  providers: [
    FormsService,
    AsideService,
    CreditAppResolver,
    SystemFieldsResolver,
    ThemeDataService,
  ]

})
export class FormsModule { }
