import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { FormsService } from '../../shared/services/forms.service';

@Injectable()
export class CreditAppResolver implements Resolve<any> {
  constructor (private formsService: FormsService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.formsService.getCreditApp(route.paramMap.get('creditAppId'));
  }
}
