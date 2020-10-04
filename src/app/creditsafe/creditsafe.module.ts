import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule, FormlyFieldInput } from '@ngx-formly/bootstrap';

// Import 3rd party modules and components
import { GridModule } from '@progress/kendo-angular-grid';
import { AlertModule } from 'ngx-bootstrap/alert';

import { BusinessSearchComponent } from './business-search/business-search.component';

import { CreditsafeRoutingModule } from './creditsafe-routing.module';
import { CreditsafeService } from './shared/services/creditsafe.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    GridModule,
    AlertModule.forRoot(),
    CreditsafeRoutingModule
  ],
  declarations: [BusinessSearchComponent],
  providers: [CreditsafeService]
})
export class CreditsafeModule { }
