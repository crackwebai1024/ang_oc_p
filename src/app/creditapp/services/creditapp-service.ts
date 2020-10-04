
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../../core/services/data.service';
import { AppConfig } from '../../config';
import { _ } from '../../shared/lodash-extensions';
import { PagedResult } from '../model';
import { map, delay, catchError } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class CreditAppService {
    creditAppEndPoint: string;

    constructor(private ds: DataService) {
        this._init();
    }

    getCreditApp(creditAppID): Observable<any> {
      return this.ds.get(this.creditAppEndPoint + creditAppID);
    }
      
    getAllCreditApps(page:number): Observable<PagedResult> {
      return this.ds.get(this.creditAppEndPoint +"list/" + page);
    }

    updateCreditAppStatus(creditAppID, status): Observable<any>{
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
      return this.ds.put(this.creditAppEndPoint+ creditAppID +"/SetCreditAppStatus",JSON.stringify(status), httpOptions);
    }

    updateCreditAppAssignedAdmin(creditAppID, assignedAdmin): Observable<any>{
      const httpOptions = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }
      return this.ds.put(this.creditAppEndPoint+ creditAppID +"/SetCreditAppAssignedAdmin",JSON.stringify(assignedAdmin), httpOptions);
    }

    private _init(): void {
      this.creditAppEndPoint = DataService.getParsedEndPointTpl(AppConfig.creditAppPath);
    }
}