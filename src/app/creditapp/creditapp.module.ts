import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule as CPSFormsModule } from '@creditpoint/forms';
import { NgxPaginationModule } from 'ngx-pagination';

// Import routing
import { CreditAppRoutingModule } from './creditapp.routing';

// Import components
import {
  CreditAppListComponent,
  CreditAppListItemComponent,
  CreditAppDetailComponent
} from './components';

//Import Services
import { CreditAppService } from './services';
import { FormlyWrapperCard, FormlyWrapperGroup, FormlyWrapperHorizontal, FormlyFieldStatic, RepeatSectionComponent, TermConditionsComponent } from '@creditpoint/forms';
import { ButtonWrapperComponent } from '../forms/shared/formly-components/button-wrapper.component';
import { AttachmentWrapperComponent } from '../forms/shared/formly-components/attachment.component';
import { SharedModule } from '../shared/shared.module';
import { FormlyModule } from '@ngx-formly/core';
import { TabsModule, ModalModule } from 'ngx-bootstrap';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { NgSpinKitModule } from 'ng-spin-kit';
export function minValidationMessage(err, field) {
  return `This value should be greater or equal to ${field.templateOptions.min}.`;
}
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CreditAppRoutingModule,
    NgxPaginationModule,
    CPSFormsModule,
    NgSpinKitModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'card', component: FormlyWrapperCard },
        { name: 'group', component: FormlyWrapperGroup },
        { name: 'field-horizontal', component: FormlyWrapperHorizontal },
      ],
      types: [
        { name: 'static', component: FormlyFieldStatic },
        { name: 'repeat', component: RepeatSectionComponent },
        { name: 'terms-conditions', component: TermConditionsComponent },
      ],
      validators: [
        { name: 'requiredTrue', validation: Validators.requiredTrue },
      ]
    }),
    SharedModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    FormlyBootstrapModule
  ],
  declarations: [
    CreditAppListComponent,
    CreditAppListItemComponent,
    CreditAppDetailComponent
  ],
  providers: [
    CreditAppService,
    ButtonWrapperComponent,
    AttachmentWrapperComponent,
  ],
  entryComponents: [
    CreditAppListComponent
  ]
})
export class CreditAppModule { }
