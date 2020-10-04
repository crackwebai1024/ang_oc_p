
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { map, delay, catchError, switchMap } from 'rxjs/operators';

import { DataService } from '../../../core/services/data.service';
import { AppConfig } from '../../../config';
import { _ } from '../../../shared/lodash-extensions';
import { AuthService } from '@creditpoint/spa';

@Injectable()
export class FormsService {
  templateEndPoint: string;
  creditAppEndPoint: string;
  docuSignEndPoint: string;
  userEndPoint: string;

  private fileSaveEvent = new Subject<any>();
  fileSaveEvent$ = this.fileSaveEvent.asObservable();

  private fileDeleteEvent = new Subject<any>();
  fileDeleteEvent$ = this.fileDeleteEvent.asObservable();

  private fileSaveFailEvent = new Subject<any>();
  fileSaveFailEvent$ = this.fileSaveFailEvent.asObservable();

  private attachemntCheckEvent = new Subject<any>();
  attachemntCheckEvent$ = this.attachemntCheckEvent.asObservable();

  constructor(private ds: DataService) {
    this._init();
  }

  fileSave($event: any) {
    this.fileSaveEvent.next($event);
  }

  fileDelete($event: any) {
    this.fileDeleteEvent.next($event);
  }

  fileSaveFail($event: any) {
    this.fileSaveFailEvent.next($event);
  }

  checkAttachments(uploadedFileList: any) {
    this.attachemntCheckEvent.next(uploadedFileList);
  }

  getTemplateByID(templateID): Observable<any> {
    return this.ds.get(this.templateEndPoint + templateID)
      .pipe(
        map(template => {
          return template;
        }),
        catchError(this.ds.handleError)
      );
  }

  createTemplate(template): Observable<any> {
    return this.ds.post(this.templateEndPoint, template)
      .pipe(
        catchError(this.ds.handleError)
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

  getCreditApp(creditAppID): Observable<any> {
    return this.ds.get(this.creditAppEndPoint + creditAppID)
      .pipe(
        map(creditApp => {
          return creditApp;
        }),
        delay(1500),
        catchError(this.ds.handleError)
      );
  }

  deletCreditApp(creditAppID): Observable<any> {
    return this.ds.delete(this.creditAppEndPoint + creditAppID)
      .pipe(
        map(creditApp => {
          return creditApp;
        }),
        delay(1500),
        catchError(this.ds.handleError)
      );
  }

  downloadCreditAppPDF(creditAppID, hideBlankFields): Observable<any> {
    return this.ds.get(DataService.getParsedEndPointPdf(`${AppConfig.pdfDownloadCreditAppPath}&creditAppID=${creditAppID}&hideBlankFields=${hideBlankFields}`),
      { responseType: 'blob' });
  }

  downloadBlankCreditAppPDF(templateID): Observable<any> {
    return this.ds.get(DataService.getParsedEndPointPdf(`${AppConfig.pdfDownloadTemplatePath}&templateID=${templateID}`),
      { responseType: 'blob' });
  }

  getCreditApps(): Observable<any> {
    return this.ds.get(this.creditAppEndPoint)
      .pipe(
        map(creditApps => {
          return creditApps;
        }),
        catchError(this.ds.handleError)
      );
  }

  addCreditApp(creditApp): Observable<any> {
    return this.ds.post(this.creditAppEndPoint, creditApp)
      .pipe(
        map(crdApp => {
          return crdApp;
        }),
        catchError(this.ds.handleError)
      );
  }

  updateCreditApp(creditAppID, creditApp): Observable<any> {
    return this.ds.put(this.creditAppEndPoint + creditAppID, creditApp);
  }

  submitCreditApp(creditAppID): Observable<any> {
    const auth: any = AuthService.instance.auth;
    return this.ds.post(this.creditAppEndPoint + creditAppID + '/Submit', {
      'creditAppID' : creditAppID,
      'apiVersion': auth.apiCreditApp,
      'uiVersion': auth.appVersion,
      'language': auth.locale,
    });
  }

  getUserRoles(): Observable<any> {
    return this.ds.get(this.userEndPoint + 'UserRoles')
      .pipe(
        map(role => {
          sessionStorage.setItem('Role', JSON.stringify(role));
        }),
        catchError(this.ds.handleError)
      );
  }

  getDocuSignRecipientView(name: string, email: string, returnUrl: string, creditAppID: string, documentHtml: string): Observable<any> {
    const authInfo = JSON.parse(localStorage.getItem('auth'));
    return this.ds.post(this.docuSignEndPoint +
      'RecipientView?name=' + name +
      '&email=' + email +
      '&returnUrl=' + returnUrl +
      '&creditAppAPIVersion=' + authInfo.apiCreditApp +
      '&creditAppUIVersion=' + authInfo.appVersion +
      '&language=' + authInfo.locale +
      '&creditAppID=' + creditAppID,
      JSON.stringify(documentHtml), {
        headers: {
          'content-type': 'application/json'
        }
      })
      .pipe(
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
    this.templateEndPoint = DataService.getParsedEndPointTpl(AppConfig.templatePath);
    this.creditAppEndPoint = DataService.getParsedEndPointTpl(AppConfig.creditAppPath);
    this.docuSignEndPoint = DataService.getParsedEndPointTpl(AppConfig.docuSignPath);
    this.userEndPoint = DataService.getParsedEndPointTpl(AppConfig.userPath);
  }
}
