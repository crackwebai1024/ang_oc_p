import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { DataService } from '../../../core/services/data.service';
import { AppConfig } from '../../../config';
import { DesignerTemplate } from '../models/designer-template';

@Injectable()
export class TemplateService {
  private _templateEndPoint: string;

  constructor(private ds: DataService) {
    this._templateEndPoint = DataService.getParsedEndPointTpl(AppConfig.templatePath);
  }

  getTemplateByID(templateID: string): Observable<any> {
    return this.ds.get(this._templateEndPoint + templateID)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  createTemplate(template: DesignerTemplate): Observable<any> {
    return this.ds.post(this._templateEndPoint, template)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  updateTemplate(template: DesignerTemplate): Observable<any> {
    return this.ds.put(this._templateEndPoint + template.id, template)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  getTemplates(): Observable<any> {
    return this.ds.get(this._templateEndPoint)
      .pipe(
        catchError(this.ds.handleError)
      );
  }

  deleteTemplate(templateID: string): Observable<any> {
    return this.ds.delete(this._templateEndPoint + templateID)
     .pipe(
       catchError(this.ds.handleError)
     );
  }
}
