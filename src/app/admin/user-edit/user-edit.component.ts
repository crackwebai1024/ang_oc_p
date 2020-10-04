import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ToasterService } from 'angular2-toaster';
import { AuthRole, AuthService } from '@creditpoint/spa';

import { _ } from '../../shared/lodash-extensions';
import { User } from '../../shared/models/user';
import { RoleType } from '../../shared/models/role-type';
import { RolesService } from '../shared/services/roles.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  @Input() user: User;
  @Output() close = new EventEmitter<boolean>();
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  roles: Array<AuthRole> = [];
  selectedRoles: Array<AuthRole> = [];
  errorSaving: boolean = false;
  isSelf: boolean = false;

  constructor(
    private toaster: ToasterService,
    private authService: AuthService,
    private rolesService: RolesService,
    private userService: UserService) { }

  ngOnInit() {
    // Determine if editing self.
    const self = <User>this.authService.user;
    this.isSelf = self.userName === this.user.userName;

    // Grab all roles
    this.roles = this.rolesService.getUserRoles()
      .filter((role) => {
        // Include if not self and has Admin role.
        return !(this.isSelf && role.value === RoleType.Admin);
      });

    // Uncomment when ready to support full user edit.
    // this.setupFields();

    this.setupUserForEdit();
  }

  setupFields() {
    this.fields = [
      {
        key: 'firstName',
        type: 'input',
        templateOptions: {
          label: 'First Name',
          required: true,
          addonLeft: {
            class: 'fa fa-user',
          }
        }
      },
      {
        key: 'lastName',
        type: 'input',
        templateOptions: {
          label: 'Last Name',
          required: true,
          addonLeft: {
            class: 'fa fa-user',
          }
        }
      },
      {
        key: 'userName',
        type: 'input',
        templateOptions: {
          label: 'Email',
          required: true,
          pattern: /(?:[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z--9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
          addonLeft: {
            class: 'fa fa-at',
          }
        },
        validation: {
          messages: {
            pattern: 'Please enter a valid email address.',
          },
        }
      }
    ];
  }

  setupUserForEdit() {
    // Copy user to model.
    // Uncomment when ready to support full user edit.
    // this.model = Object.assign(this.model, this.user);

    // Copy user roles to selectedRoles.
    this.user.roles.forEach((roleValue) => {
      // Include if not self and has Admin role.
      if (!(this.isSelf && roleValue === RoleType.Admin)) {
        const role = this.rolesService.getRoleByValue(roleValue);
        if (role !== undefined) {
          this.selectedRoles.push(role);
        }
      }
    });
  }

  confirmEdit() {
    // Clear error flag.
    this.errorSaving = false;

    // Copy model to user.
    // Uncomment when ready to support full user edit.
    // this.user = Object.assign(this.user, this.model);

    // Take selectedRoles and update user.roles
    this.user.roles = _.map(this.selectedRoles, 'value');

    // If self, add back Admin role.
    if (this.isSelf) {
      this.user.roles.push(RoleType.Admin);
    }

    this.userService.updateUser(this.user)
      .subscribe({
        next: () => {
          setTimeout(() => {
            this.toaster.pop('success', 'User Updated', `${this.user.userName} has been updated.`);
          }, 1000);
        },
        error: (err) => {
          this.errorSaving = true;
        },
        complete: () => {
          this.close.emit(true);
        }
      });
  }

  cancelEdit() {
    this.close.emit(false);
  }
}
