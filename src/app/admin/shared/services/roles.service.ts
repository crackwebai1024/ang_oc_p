import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { AuthRole } from '@creditpoint/spa';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DataService } from '../../../core/services/data.service';
import { User } from '../../../shared/models/user';
import { RoleType } from '../../../shared/models/role-type';

@Injectable()
export class RolesService {
  private _userEndPoint: string;

  constructor(private ds: DataService) { }

  saveUserRoles(user: User): Observable<any> {
    return this.ds.put(this._userEndPoint + user.userName, user)
      .pipe(catchError(this.ds.handleError));
  }

  getUserRoles(): AuthRole[] {
    const roles = [
      {
        name: this.getRoleName(RoleType.Admin),
        value: RoleType.Admin
      },
      {
        name: this.getRoleName(RoleType.TemplateAdmin),
        value: RoleType.TemplateAdmin
      },
      {
        name: this.getRoleName(RoleType.ClientAdmin),
        value: RoleType.ClientAdmin
      },
      {
        name: this.getRoleName(RoleType.Demo),
        value: RoleType.Demo
      }
      // {
      //   name: this.getRoleName(RoleType.WorkflowAdmin),
      //   value: RoleType.WorkflowAdmin
      // },
      // {
      //   name: this.getRoleName(RoleType.ClientUser),
      //   value: RoleType.ClientUser
      // }
    ];

    return roles;
  }

  getRoleByValue(roleValue: string) {
    const roles = this.getUserRoles();

    return roles.find((role) => role.value === roleValue);
  }

  private getRoleName(roleType: RoleType) {
    return roleType.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
  }
}
