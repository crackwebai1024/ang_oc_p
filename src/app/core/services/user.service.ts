import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
// import { AuthService } from '@creditpoint/spa';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AppConfig } from '../../config';
import { DataService } from './data.service';
import { User } from '../../shared/models/user';

@Injectable()
export class UserService {
  currentUserEndPoint: string;
  userEndPoint: string;
  authUserEndPoint: string;
  changePasswordEndPoint: string;

  constructor(private ds: DataService) {
    this._init();
  }

  // Used by AppInitializer on login
  getCurrentUser(): Observable<any> {
    return this.ds.get(this.currentUserEndPoint)
      .pipe(catchError(this.ds.handleError));
  }

  getUsers(): Observable<any> {
    return this.ds.get(this.userEndPoint)
      .pipe(catchError(this.ds.handleError));
  }

  getClientAdmins(): Observable<any> {
    return this.ds.get(this.userEndPoint + "GetClientAdmins")
      .pipe(catchError(this.ds.handleError));
  }

  createUser(user: User): Observable<any> {
    return this.ds.post(this.userEndPoint, user)
      .pipe(catchError(this.ds.handleError));
  }

  updateUser(user: User): Observable<any> {
    return this.ds.put(this.userEndPoint + user.userName, user)
      .pipe(catchError(this.ds.handleError));
  }

  changeUserPassword(userName: string, password: string): Observable<any> {
    return this.ds.put(this.changePasswordEndPoint + '?userName=' + userName + '&password=' + password, null)
      .pipe(catchError(this.ds.handleError));
  }

  // Not currently using.
  searchCpxUsers(userName: string): Observable<any> {
    return this.ds.get(this.authUserEndPoint,
      {
        params:
          {
            userName: userName
          }
      }).pipe(catchError(this.ds.handleError));
  }

  getCpxUsers(): Observable<any> {
    return this.ds.get(this.authUserEndPoint)
      .pipe(catchError(this.ds.handleError));
  }

  private _init(): void {
    this.currentUserEndPoint = DataService.getParsedEndPointTpl(AppConfig.currentUserPath);
    this.userEndPoint = DataService.getParsedEndPointTpl(AppConfig.userPath);
    this.authUserEndPoint = DataService.getParsedEndPointTpl(AppConfig.authUserPath);
    this.changePasswordEndPoint = DataService.getParsedEndPointTpl(AppConfig.changePasswordPath);
  }
}
