import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { TemplateService } from '../services/template.service';

@Injectable()
export class TemplateResolver implements Resolve<any> {
  constructor (private templateService: TemplateService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.templateService.getTemplateByID(route.paramMap.get('id'));
  }
}
