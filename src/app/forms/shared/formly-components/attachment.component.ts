import { Component, ViewChild, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { RouterModule, Router } from '@angular/router';
import { SuccessEvent } from '@progress/kendo-angular-upload';
import { FilesService } from '../../../core/services/files.service';
import { FormsService } from '../services/forms.service';
import { Subscription } from 'rxjs';

@Component({
selector: 'formly-wrapper-attachment',
template: `
 <div class="form-group">
    <div class="row"><div class="col-sm-3">{{to.documentType}} {{isRequired}}</div></div>
    <div class="row">
    <div class="col-sm-12">
    <div [ngClass]="{'upload-wrapper': true, 'danger': (requiredText !== undefined && requiredText !== '' )}" ng>
    <kendo-upload
        #specificUpload="kendoUpload"
        class="w-100"
        [multiple]="true"
        [saveUrl]="uploadSaveUrl"
        [removeUrl]="uploadRemoveUrl"
        [removeField]="uploadRemoveField"
        [saveField]="uploadSaveField"
        [responseType]="uploadResponseType"
        [disabled]="!this.to.unsubmitted"
        [ngModel]="fileList"
        (success)="onFileUploadSuccess($event)"
        (error)="onFileUploadFailed($event)">
    </kendo-upload>
    </div>
    <div><small #uploadErrorMessages class='text-danger text-small'>{{ requiredText }}</small></div>
    </div>
    <ng-container #fieldComponent></ng-container>
</div>
`,
styles: [`
    .credit-safe-search {
        position:absolute;
        top:0px;
        right:0px;
    }
    .upload-wrapper {
      margin: 0px;
      padding: 0px;
    }
    .danger {
      border: red 1px solid;
    }
`]
})
export class AttachmentWrapperComponent  extends FieldWrapper implements OnInit, OnDestroy {
    @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
    @ViewChild('specificUpload') specificUpload: any;
    uploadSaveUrl: string = null;
    uploadRemoveUrl: string = null;
    uploadSaveField: string = 'file';
    uploadRemoveField: string = 'fileName';
    uploadResponseType: string = 'text';
    isRequired: string;
    fileList: any[];
    formSubmitEvent: Subscription;
    requiredText: string;

    constructor(
    private router: Router,
    private filesService: FilesService,
    private formsService: FormsService) {
        super();
    }

    ngOnInit() {
        this.uploadSaveUrl = this.filesService.getFileUploadEndpoint();
        this.uploadRemoveUrl = this.filesService.getFileDeletionEndpoint();
        this.fileList = [];
        if (this.to.fileList !== undefined) {
            this.fileList = this.to.fileList.filter(file => file.fileType === this.to.documentType);
        }
        this.isRequired = this.to.isRequired ? '*' : '';
        this.loadFileList(this.fileList);

        this.formSubmitEvent = this.formsService.attachemntCheckEvent$.subscribe((uploadedFileList: any) => {
          this.fileList = uploadedFileList.filter(file => file.fileType === this.to.documentType);
          this.isValid();
        });
    }

    ngOnDestroy() {
        if (this.formSubmitEvent !== undefined) {
            this.formSubmitEvent.unsubscribe();
        }
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
            this.formsService.fileDelete(evt);
            this.isValid();
        } else {
            const file = {
              internalFileName: evt.response.body,
              publicFileName: evt.files[0].name,
              fileSize: evt.files[0].size,
              fileType: this.to.documentType,
              uid: evt.files[0].uid
            };
            this.formsService.fileSave({event: evt, file: file});
            this.requiredText = '';
        }
    }

    onFileUploadFailed(event: any) {
        this.formsService.fileSaveFail(event);
    }

    isValid() {
      if (this.to.isRequired) {
        if (this.fileList.length < 1) {
          this.requiredText = 'This field is required';
        }
      }
    }
}
