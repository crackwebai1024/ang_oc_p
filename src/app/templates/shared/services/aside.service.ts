import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
// import { HttpErrorResponse } from '@angular/common/http/src/response';
import { Observable, of, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { _ } from '../../../shared/lodash-extensions';
import { DataService } from '../../../core/services/data.service';
import { AppConfig } from '../../../config';
import { DesignerItem } from '../models/designer-item';
import { SampleFields } from '../data/fields';
import { FieldTypes } from '../data/fieldtypes';
import { Util } from '@creditpoint/util';
import 'rxjs/add/operator/map';
import { AuthService } from '@creditpoint/spa';
import { DocumentTypeModel } from '../models/document-type.model';
import { SpecificUpload } from '../models/designer-required-file-upload';


@Injectable()
export class AsideService {
  static instance: AsideService;
  private testUrl: any = '';
  private _templateFieldsEndPoint: string;
  private globalFields: any;

  constructor(private ds: DataService) {
    AsideService.instance = this;
    this._templateFieldsEndPoint = DataService.getParsedEndPointTpl(AppConfig.templateFieldsPath);
  }

  @Output() addDependancy: EventEmitter<DocumentTypeModel> = new EventEmitter();
  @Output() removeDependancy: EventEmitter<DocumentTypeModel> = new EventEmitter();
  @Output() currentDependancy: EventEmitter<SpecificUpload[]> = new EventEmitter();

  addDocumentDependancy(docType: DocumentTypeModel= null) {
    this.addDependancy.emit(docType);
  }

  removeDocumentDependancy(docType: DocumentTypeModel = null) {
    this.removeDependancy.emit(docType);
  }

  currentDocumentDependancy(docTypes: SpecificUpload[] = null) {
    this.currentDependancy.emit(docTypes);
  }

  getFieldTypes(): Observable<DesignerItem[]> {
    return of(FieldTypes);
  }

  getGlobalFields(): Observable<any> {
   return this.ds.get(this._templateFieldsEndPoint)
    .map (fields => this.globalFields = fields)
    .pipe(
      catchError(this.ds.handleError)
    );
  }

  addGlobalFields(fields: DesignerItem, isGlobal: boolean): Observable<any> {
    const param = new HttpParams();
    param.set('isGlobal', 'true');
    // return this.ds.post(this._templateFieldsEndPoint, {fields}, {params: param})
    return this.ds.post(this._templateFieldsEndPoint + '?isGlobal =' + isGlobal, fields)
    .pipe(
      catchError(this.ds.handleError)
    );
  }

   updateGlobalFields(fieldID: string, fields: DesignerItem): any {
      return this.ds.put(this._templateFieldsEndPoint + fieldID, fields)
      .pipe(
        catchError(this.ds.handleError)
      );
   }

   getExistFieldId(fieldName: string): any {
     const fieldExist = this.globalFields.find(field => field.name === fieldName);
     return !Util.isEmpty(fieldExist) ? fieldExist.id : null; // get mongoID

    }

    getDocumentTypes(): Observable<any> {
      return this.ds.get(DataService.getParsedEndPointTpl(`${AppConfig.filePath}/GetFileTypes`))
       .pipe(
         catchError(this.ds.handleError)
       );
     }
}
