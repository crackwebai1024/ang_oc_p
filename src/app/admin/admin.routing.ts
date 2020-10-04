import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserSummaryListComponent } from './user-summary-list/user-summary-list.component';
import { RoleSummaryListComponent } from './role-summary-list/role-summary-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UserSummaryListComponent
  },
  {
    path: 'roles',
    component: RoleSummaryListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
