import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, filter, map } from 'rxjs/operators';

import { AsideService } from '../../../templates/shared/services/aside.service';


@Injectable()
export class SystemFieldsResolver implements Resolve<any> {
  constructor (private asideService: AsideService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.asideService.getGlobalFields();
  }
}
