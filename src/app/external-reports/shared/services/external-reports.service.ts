import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable, throwError } from 'rxjs';
import { map, delay, catchError, switchMap } from 'rxjs/operators';

import { AppConfig } from '../../../config';
import { DataService } from '../../../core/services/data.service';

@Injectable()
export class ExternalReportsService {
  creditAppEndPoint: string;
  docuSignEndPoint: string;

  constructor(private ds: DataService) {
    this._init();
  }

  getCreditApp(creditAppID): Observable<any> {
    return this.ds.get(this.creditAppEndPoint + creditAppID)
      .pipe(
        delay(1500)
      );
  }

  getNewCreditApp(templateID): Observable<any> {
    return this.ds.get(this.creditAppEndPoint + 'NewCreditApp/' + templateID)
      .pipe(
        map(newCreditApp => {
          return newCreditApp;
        }),
        delay(3000),
        catchError(this.ds.handleError)
      );
  }

  downloadDocument(creditAppID: string) {
    let documentList: any;
    let envelopeId: string;
    return this.ds.get(this.creditAppEndPoint + creditAppID)
      .pipe(
        switchMap(creditapp => {
          envelopeId = creditapp.docuSignEnvelopeID;
          return this.ds.get(this.docuSignEndPoint + 'GetDocumentList?envelopeID=' + envelopeId)
            .pipe(
              switchMap(data => {
                documentList = data[0].documentId;
                return this.ds.get(this.docuSignEndPoint + 'DownloadDocument?envelopeID=' + envelopeId + '&documentID=' + documentList,
                { responseType: 'blob' });
              }
            )
          );
        })
      );
  }

  private _init(): void {
    this.creditAppEndPoint = DataService.getParsedEndPointTpl(AppConfig.creditAppPath);
    this.docuSignEndPoint = DataService.getParsedEndPointTpl(AppConfig.docuSignPath);
  }
}
