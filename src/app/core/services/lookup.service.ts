import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataService } from './data.service';

@Injectable()
export class LookupService {
  countryUrl: string = 'assets/data/countries.json';
  stateUrl: string = 'assets/data/states.json';

  constructor(private ds: DataService) { }

  getCountries(): Observable<any> {
    return this.ds.get(this.countryUrl);
  }

  getStates(): Observable<any> {
    return this.ds.get(this.stateUrl);
  }
}
