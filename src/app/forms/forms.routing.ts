import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstRouteGuard, CanDeactivateGuard } from '@creditpoint/spa';

import { FormComponent } from './form/form.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { FormListComponent } from './form-list/form-list.component';
import { CreditAppResolver } from './shared/resolvers/credit-app.resolver';
import { SystemFieldsResolver } from './shared/resolvers/system-fields.resolver';
import { FormNewComponent } from './form-new/form-new.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [FirstRouteGuard],
    component: FormListComponent
  },
  {
    path: 'list',
    component: FormListComponent
  },
  {
    path: 'form-new/:id',
    component: FormNewComponent
  },
  {
    path: 'form',
    component: FormComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'form/:id',
    component: FormComponent
  },
  {
    path: 'form/:templateId',
    component: FormComponent,
    canDeactivate: [CanDeactivateGuard]
  },
  {
    path: 'confirmation',
    component: ConfirmationComponent
  },
  {
    path: 'confirmation/:creditAppId',
    component: ConfirmationComponent,
    resolve: {
      creditApp: CreditAppResolver,
      systemFields: SystemFieldsResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormsRoutingModule { }
