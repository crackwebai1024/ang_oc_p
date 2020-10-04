import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { UploadModule } from '@progress/kendo-angular-upload';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule as CPSFormsModule } from '@creditpoint/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';

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
  FormlyGroupExtended
} from '@creditpoint/forms';

import { CreditAppReportComponent } from './credit-app-report/credit-app-report.component';

import { ExternalReportsRoutingModule } from './external-reports.routing';
import { ExternalReportsService } from './shared/services/external-reports.service';
import { DataService } from '../core/services/data.service';
import { ThemeService } from '@creditpoint/spa/branding-services';
import { ThemeDataService } from '../shared/services/themes.service';
import { AttachmentReportWrapperComponent } from '../forms/shared/formly-components/attachment-report.component';
import { CreditSafeComponent } from './shared/formly-components/creditsafe.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      wrappers: [
        { name: 'card', component: FormlyWrapperCard },
        { name: 'group', component: FormlyWrapperGroup },
        { name: 'field-horizontal', component: FormlyWrapperHorizontal },
        { name: 'creditsafe', component: CreditSafeComponent },
        { name: 'attachment', component: AttachmentReportWrapperComponent}
      ],
      types: [
        { name: 'static', component: FormlyFieldStatic },
        { name: 'repeat', component: RepeatSectionComponent }
      ],
      validators: [
        { name: 'requiredTrue', validation: Validators.requiredTrue },
      ]
    }),
    FormlyBootstrapModule,
    CPSFormsModule,
    ExternalReportsRoutingModule,
    GridModule,
    UploadModule,
    TabsModule.forRoot()
  ],
  declarations: [CreditAppReportComponent, AttachmentReportWrapperComponent, CreditSafeComponent],
  providers: [
    ExternalReportsService,
    ThemeDataService,
    ThemeService,
    DataService
  ]
})
export class ExternalReportsModule { }
