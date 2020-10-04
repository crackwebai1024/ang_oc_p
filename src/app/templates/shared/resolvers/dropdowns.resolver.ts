import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ParamMap, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { DropdownListService } from '../services/dropdown-list.service';

@Injectable()
export class DropdownsResolver implements Resolve<any> {
  constructor (private dropdownListService: DropdownListService) {
  }

  resolve(route: ActivatedRouteSnapshot) {
    return this.dropdownListService.getDropdownLists();
  }
}
