import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ProgressOutlineComponent } from './components/progress-outline/progress-outline.component';
import { ScrollSpyDirective } from './directives/scrollSpy/scroll-spy.directive';
import { AutoLoginComponent } from './components/auto-login/auto-login.component';

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
    ScrollToModule.forRoot(),
  ],
  declarations: [
    PasswordResetComponent,
    ProgressOutlineComponent,
    ScrollSpyDirective,
    AutoLoginComponent
  ],
  exports: [
    PasswordResetComponent,
    ProgressOutlineComponent,
    ScrollSpyDirective,
    AutoLoginComponent
  ]
})
export class SharedModule { }
