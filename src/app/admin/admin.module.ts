import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule as CpxForms } from '@creditpoint/forms';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgSpinKitModule } from 'ng-spin-kit';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

// Import components
import { RoleEditComponent } from './role-edit/role-edit.component';
import { RoleSummaryListComponent } from './role-summary-list/role-summary-list.component';
import { RoleSummaryItemComponent } from './role-summary-item/role-summary-item.component';
import { UserAddComponent } from './user-add/user-add.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserSummaryItemComponent } from './user-summary-item/user-summary-item.component';
import { UserSummaryListComponent } from './user-summary-list/user-summary-list.component';

// Import services
import { RolesService } from './shared/services/roles.service';

// Import routing
import { AdminRoutingModule } from './admin.routing';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validationMessages: [
        { name: 'required', message: 'This field is required' }
      ]
    }),
    FormlyBootstrapModule,
    TooltipModule.forRoot(),
    CpxForms,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    AlertModule.forRoot(),
    NgSpinKitModule,
    DropDownsModule,
    AdminRoutingModule,
    TypeaheadModule.forRoot()
  ],
  declarations: [
    RoleEditComponent,
    RoleSummaryListComponent,
    RoleSummaryItemComponent,
    UserAddComponent,
    UserEditComponent,
    UserSummaryItemComponent,
    UserSummaryListComponent
  ],
  providers: [
    BsModalService,
    BsModalRef,
    RolesService
  ],
  entryComponents: [
    UserAddComponent,
    RoleEditComponent
  ]
})
export class AdminModule { }
