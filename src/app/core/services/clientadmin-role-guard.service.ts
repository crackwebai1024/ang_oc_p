import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@creditpoint/spa';

@Injectable()
export class ClientAdminRoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if (this.auth.user.roles.indexOf('ClientAdmin') !== -1) {
      return true;
    }
    return false;
  }
}
