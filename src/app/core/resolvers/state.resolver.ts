import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LookupService } from '../services/lookup.service';

@Injectable({
  providedIn: 'root'
})
export class StateResolver implements Resolve<any> {
  constructor (private lookupService: LookupService) {}

  resolve() {
    return  this.lookupService.getStates()
      .pipe(
        catchError(err => of('data not available at this time'))
      );
  }
}
