import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from '@creditpoint/spa';

import { UserService } from '../../../core/services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  title = 'Reset Password';
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private toaster: ToasterService) { }

  ngOnInit() {
    this.fields = [
      {
        key: 'password',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Password',
          required: true,
          pattern: /^(?=(?:.*[A-Z]){1,})(?=(?:.*[a-z]){1,})(?=(?:.*\d){1,})(?=(?:.*[!@#$%^&*()\-_=+{};:,<.>]){1,})(?!.*(.)\1{2})([A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{8,})$/,
          addonLeft: {
            class: 'fa fa-lock',
          }
        },
        validation: {
          messages: {
            pattern: 'Must contain an uppercase, lowercase, number, special character, and must contain at least 8 characters.',
          },
        }
      },
      {
        key: 'passwordConfirm',
        type: 'input',
        templateOptions: {
          type: 'password',
          label: 'Confirm Password',
          required: true,
          addonLeft: {
            class: 'fa fa-lock',
          }
        },
        validators: {
          fieldMatch: {
            expression: (control) => control.value === this.model.password,
            message: 'Passwords must match',
          },
        },
        expressionProperties: {
          'templateOptions.disabled': () => !this.form.get('password').valid,
        },
      }
    ];
  }

  resetPassword() {
    const user = <User>this.authService.user;
    this.userService.changeUserPassword(user.userName, this.form.get('password').value)
      .subscribe(data => {
        this.toaster.pop('success', 'Password Changed', 'Your password has been changed.');
        this.form.reset();
      });
  }
}
