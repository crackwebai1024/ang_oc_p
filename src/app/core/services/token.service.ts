import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '@creditpoint/spa';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { AppConfig } from '../../config';

@Injectable()
export class TokenService {
  private _continueParam: string;
  private _authenticationUrl: string;

  constructor(protected http: HttpClient) {
    this._continueParam = `continue=${location.href}`;
    this._authenticationUrl = `${AppConfig.authUrl}?${this._continueParam}`;
  }

  refreshToken(): Observable<any> {
    const token = AuthService.instance.getToken();
    const url = `${AppConfig.apiAuthUrl}/${AppConfig.refreshTokenPath}?token=${token}`;

    return this.http.post(url, '').pipe(
      map((refreshToken: any) => {
        AuthService.instance.setToken(refreshToken.token);
        return refreshToken;
      }),
      catchError((err: HttpErrorResponse) => {
        // Refresh token failed so redirect to authentication.
        // localStorage.clear();
        // location.replace(this._authenticationUrl);

        return throwError(err.message);
      })
    );
  }
}
