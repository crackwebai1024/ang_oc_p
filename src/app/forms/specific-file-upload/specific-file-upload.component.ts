import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FilesService } from '../../core/services/files.service';
import { AppConfig } from '../../config';
import { SuccessEvent } from '@progress/kendo-angular-upload';

@Component({
  selector: 'specific-file-upload',
  templateUrl: './specific-file-upload.component.html',
  styleUrls: ['./specific-file-upload.component.scss'],

})
export class SpecificFileUploadComponent implements OnInit {
  @ViewChild('specificUpload') specificUpload: any;

  @Input() fileType: string;
  @Input() fileRequired: boolean;
  @Input() fileID: string;
  @Input() fileList: any[];
  @Input() uploadDisabled: boolean;
  @Output() removeFile: EventEmitter<any> = new EventEmitter();
  @Output() addFile: EventEmitter<any> =  new EventEmitter();
  @Output() error: EventEmitter<any> = new EventEmitter();
  @Output() complete: EventEmitter<any> = new EventEmitter();
  uploadSaveUrl: string = null;
  uploadRemoveUrl: string = null;
  uploadSaveField: string = 'file';
  uploadRemoveField: string = 'fileName';
  uploadResponseType: string = 'text';
  requiredMark: string = '';

  constructor(
    private filesService: FilesService
  ) { }

  ngOnInit() {
    this.uploadSaveUrl = this.filesService.getFileUploadEndpoint();
    this.uploadRemoveUrl = this.filesService.getFileDeletionEndpoint();
    this.fileList = this.fileList.filter(file => file.fileTypeID === this.fileID);
    this.requiredMark = this.fileRequired ? '*' : '' ;
    this.loadFileList(this.fileList);
  }

  loadFileList(files: any[]) {
    if (files.length > 0) {
      this.specificUpload.writeValue(files.map(file => {
        return {
          name: file.publicFileName,
          uid: file.internalFileName,
          size: file.fileSize
        };
      }));
    }
  }

  onFileUploadSuccess(evt: SuccessEvent) {
    if (evt.response.type !== 4) {
      return;
    }
    if (evt.operation === 'remove') {
      this.removeFile.emit(evt);
    } else {
      if (this.fileType != null) {
        const file = {
          internalFileName: evt.response.body,
          publicFileName: evt.files[0].name,
          fileSize: evt.files[0].size,
          fileType: this.fileType,
          fileTypeID: this.fileID,
          uid: evt.files[0].uid
        };
        this.addFile.emit({event: evt, file: file});
    } else {
      console.log('no file type specified');
      }
    }
  }

  onFileUploadFailed(evt: any) {
    this.error.emit(evt);
  }

  onFileUploadComplete(evt: any) {
    this.complete.emit(evt);
  }
}


