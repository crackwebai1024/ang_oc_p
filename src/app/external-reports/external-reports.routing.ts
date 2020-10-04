import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SpaSimpleLayoutComponent } from '@creditpoint/spa';

import { CreditAppReportComponent } from './credit-app-report/credit-app-report.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'credit-app',
    pathMatch: 'full'
  },
  {
    path: 'credit-app/new/:id',
    component: CreditAppReportComponent
  },
  {
    path: 'credit-app/:id',
    component: CreditAppReportComponent
  },
  {
    path: 'credit-app/:id/:hideBlankFields',
    component: CreditAppReportComponent
  },
  {
    path: 'credit-app/:id/:hideBlankFields/:isPreview',
    component: CreditAppReportComponent
  },
  {
    path: 'credit-app/:id/:hideBlankFields/:isCore',
    component: CreditAppReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalReportsRoutingModule { }
