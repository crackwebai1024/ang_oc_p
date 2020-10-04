import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@creditpoint/spa';

import { LogoManagerComponent } from './logo-manager/logo-manager.component';
import { ThemeManagerComponent } from './theme-manager/theme-manager.component';

const routes: Routes = [
  {
    path: 'theme-manager',
    component: ThemeManagerComponent,
    canDeactivate: [CanDeactivateGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandingRoutingModule { }
