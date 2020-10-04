import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config';
import { catchError } from 'rxjs/operators';

@Injectable()

export class DocumentService {

    constructor(private ds: DataService) {}

    getDocumentTypes(): Observable<any> {
        return this.ds.get(DataService.getParsedEndPointTpl(`${AppConfig.filePath}/GetFileTypes`))
         .pipe(
            catchError(err => {
                console.warn('cpxapi did not return a result of type documents.');
                return this.ds.handleError(err);
              })
         );
       }
}
