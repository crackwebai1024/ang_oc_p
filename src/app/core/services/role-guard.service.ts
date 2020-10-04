import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '@creditpoint/spa';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}
  canActivate(): boolean {
    if ((this.auth.user.roles.indexOf('Admin') !== -1)) {
      return true;
    }
    this.router.navigate(['list']);
    return false;
  }
}
