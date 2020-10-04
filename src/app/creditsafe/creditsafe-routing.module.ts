import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessSearchComponent } from './business-search/business-search.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'business-search',
    pathMatch: 'full'
  },
  {
    path: 'business-search',
    component: BusinessSearchComponent
  },
  {
    path: 'business-search/:id',
    component: BusinessSearchComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditsafeRoutingModule { }
