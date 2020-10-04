import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@creditpoint/spa';
import { Observable, defer, of, throwError } from 'rxjs';
import { flatMap, retryWhen, scan, switchMap, takeWhile } from 'rxjs/operators';

import { AppConfig } from '../../config';
import { _ } from '../../shared/lodash-extensions';
import { TokenService } from './token.service';

@Injectable()
export class DataService {
  constructor(private http: HttpClient, private tokenService?: TokenService) { }

  public static getParsedEndPointTpl(apiPath: string): string {
    const apiBaseUrlTpl = _.template(AppConfig.apiBaseUrlTpl);
    const clientId = AuthService.instance.clientId;
    const apiBaseUrl = apiBaseUrlTpl({clientId: clientId !== null ? clientId + '.' : clientId});
    const tpl = _.template(AppConfig.endPointTpl);
    const auth: any = AuthService.instance.auth;
    return tpl({
      apiBaseUrl: apiBaseUrl,
      apiVersion: auth.apiCreditApp,
      apiPath: apiPath
    });
  }

  public static getParsedEndPointPdf(pdfApiPath: string): string {
    const apiBaseUrlPdf = AppConfig.apiBaseUrlPdf;
    const pdf = _.template(AppConfig.endPointPdf);
    const auth: any = AuthService.instance.auth;
    return pdf({
      apiBaseUrlPdf: apiBaseUrlPdf,
      pdfApiVersion: auth.apiPDF,
      pdfApiPath: _.template(pdfApiPath)({
        clientCode: AuthService.instance.clientId,
        apiVersion: auth.apiCreditApp,
        uiVersion: auth.appVersion,
        lang: auth.locale,
        token: auth.token
      }),
    });
  }

  public get(url: string, options?: object): Observable<any> {
    return defer(() => {
      return this.http.get(url, options);
    }).pipe(
      retryWhen((error) => {
        return this._refresh(error);
      })
    );
  }

  public post(url: string, body: any, options?: object): Observable<any> {
    return defer(() => {
      return this.http.post(url, body, options);
    }).pipe(
      retryWhen((error) => {
        return this._refresh(error);
      })
    );
  }

  public put(url: string, body: any, options?: object): Observable<any> {
    return defer(() => {
      return this.http.put(url, body, options);
    }).pipe(
      retryWhen((error) => {
        return this._refresh(error);
      })
    );
  }

  public delete(url: string, options?: object): Observable<any> {
    return defer(() => {
      return this.http.delete(url, options);
    }).pipe(
      retryWhen((error) => {
        return this._refresh(error);
      })
    );
  }

  public handleError(err: HttpErrorResponse) {
    return throwError(err.message);
  }

  private _refresh(obs: Observable<any>): Observable<any> {
    return obs.pipe(
      switchMap((x: any) => {
        if (x.status === 401) {
          return of(x);
        }
        return throwError(x);
      }),
      scan((acc, value) => {
        return acc + 1;
      }, 0),
      takeWhile(acc => acc < 3),
      flatMap(() => {
        return this.tokenService.refreshToken();
      })
    );
  }
}
