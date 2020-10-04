import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '@creditpoint/spa';

import { DesignerStepComponent } from './designer/designer-step/designer-step.component';
import { TemplatesListComponent } from './templates-list/templates-list.component';
import { TemplateResolver } from './shared/resolvers/template.resolver';
import { DropdownsResolver } from './shared/resolvers/dropdowns.resolver';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path: 'designer',
    component: DesignerStepComponent,
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      dropdowns: DropdownsResolver
    }
  },
  {
    path: 'designer/:id',
    component: DesignerStepComponent,
    canDeactivate: [CanDeactivateGuard],
    resolve: {
      template: TemplateResolver,
      dropdowns: DropdownsResolver
    }
  },
  {
    path: 'list',
    component: TemplatesListComponent
  },
  {
    path: 'list/:id',
    component: TemplatesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplatesRoutingModule { }
