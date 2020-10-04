import { Component, OnInit, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { AuthRole } from '@creditpoint/spa';

import { _ } from '../../shared/lodash-extensions';
import { User } from '../../shared/models/user';
import { RolesService } from '../shared/services/roles.service';
import { UserService } from '../../core/services/user.service';
import { BsModalRef } from 'ngx-bootstrap';

export enum AddMode {
  New = 1,
  Cps = 2
}

@Component({
  selector: 'user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserAddComponent implements OnInit {
  addMode: AddMode;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  roles: Array<AuthRole> = [];
  selectedRoles: Array<AuthRole> = [];
  @Output() userAdd = new EventEmitter<User>();
  title: string = null;
  submitting: boolean = false;
  errorMessage: string = null;
  cpxUsers: User[];
  selected: string;

  constructor(
    public bsModalRef: BsModalRef,
    private rolesService: RolesService,
    private userService: UserService) {

  }

  ngOnInit() {
    if (this.addMode === AddMode.New) {
      this.title = 'Add New User';
      this.setupNewUserFields();
    } else {
      this.title = 'Add CPS User';
      this.loadCpxUsers();
    }

    // Grab all roles
    this.roles = this.rolesService.getUserRoles();
  }

  setupNewUserFields() {
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

  add() {
    this.submitting = true;
    this.form.disable();

    let user = new User();
    user = Object.assign(user, this.model);
    user.emailAddress = user.userName;

    // Take selectedRoles and update user.roles
    user.roles = _.map(this.selectedRoles, 'value');

    this.userService.createUser(user)
      .subscribe({
        next: () => {
          this.bsModalRef.hide();
          this.userAdd.emit(user);
        },
        error: (err) => {
          this.submitting = false;
          this.form.enable();
          this.errorMessage = 'An error occurred adding user.';
        }
      });
  }

  cancel() {
    this.bsModalRef.hide();
  }

  loadCpxUsers() {
    this.userService.getCpxUsers()
      .subscribe({
        next: (users) => this.cpxUsers = users
      });
  }

  typeaheadOnSelect($event) {
    // Selected object is $event.item
    this.model = Object.assign(this.model, $event.item);
  }
}
