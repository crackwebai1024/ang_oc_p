import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DataService } from '../../../core/services/data.service';
import { AppConfig } from '../../../config';
import { DesignerDropdownList } from '../models/designer-dropdownlist';

@Injectable()
export class DropdownListService {
  private _dropdownListEndpoint: string;

  constructor(private ds: DataService) {
    this._dropdownListEndpoint = DataService.getParsedEndPointTpl(AppConfig.dropdownListPath);
  }

  getDropdownLists(): Observable<any> {
    return this.ds.get(this._dropdownListEndpoint)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  getDropdownList(dropdownID: number): Observable<any> {
    return this.ds.get(this._dropdownListEndpoint + dropdownID)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  updateDropdownField(dropdownList: DesignerDropdownList, dropdownID: number) {
    return this.ds.put(this._dropdownListEndpoint + dropdownList.id, dropdownList)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  createDropdownList(dropdownList: DesignerDropdownList) {
    return this.ds.post(this._dropdownListEndpoint, dropdownList)
      .pipe(
        catchError(this.ds.handleError)
      );
  }
}
