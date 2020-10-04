import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditAppListComponent, CreditAppDetailComponent } from './components';


const routes: Routes = [
  {
    path: '',
    component: CreditAppListComponent
  },
  {
    path: ':id',
    component: CreditAppDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditAppRoutingModule { }
