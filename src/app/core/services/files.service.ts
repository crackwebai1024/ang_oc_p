import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DataService } from './data.service';
import { AppConfig } from '../../config';

@Injectable()
export class FilesService {
  private _filesEndPoint: string;

  constructor(private ds: DataService) { }

  downloadFile(fileName: string, friendlyName: string): Observable<any> {
    return this.ds.get(DataService.getParsedEndPointTpl(`${AppConfig.fileDownloadPath}?fileName=${fileName}&friendlyName=${friendlyName}`),
      { responseType: 'blob' });
  }

  getFileUploadEndpoint(): string {
    return DataService.getParsedEndPointTpl(AppConfig.fileUploadPath);
  }

  getFileDeletionEndpoint(): string {
    return DataService.getParsedEndPointTpl(AppConfig.fileDeletionPath);
  }
}
