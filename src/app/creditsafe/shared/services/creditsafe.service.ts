
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';

import { DataService } from '../../../core/services/data.service';
import { AppConfig } from '../../../config';
import { _ } from '../../../shared/lodash-extensions';

@Injectable()
export class CreditsafeService {
  private _creditsafeEndPoint: string;

  constructor(private ds: DataService) {
    this._creditsafeEndPoint = DataService.getParsedEndPointTpl(AppConfig.creditsafePath);
  }

  businessSearch(searchParams): Observable<any> {
    return this.ds.post(this._creditsafeEndPoint, searchParams);
  }
}
