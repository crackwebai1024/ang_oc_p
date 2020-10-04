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
    <kendo-upload
        #specificUpload="kendoUpload"
        class="w-100"
        [multiple]="true"
        [disabled]="false">
    </kendo-upload>
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
`]
})
export class AttachmentReportWrapperComponent  extends FieldWrapper implements OnInit {
    @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;
    @ViewChild('specificUpload') specificUpload: any;
    uploadSaveUrl: string = null;
    uploadRemoveUrl: string = null;
    uploadSaveField: string = 'file';
    uploadRemoveField: string = 'fileName';
    uploadResponseType: string = 'text';
    isRequired: string;
    fileList: any[];
    fileLoadEvent: Subscription;

    constructor() {
        super();
    }

    ngOnInit() {
        this.fileList = [];
        if (this.to.fileList !== undefined) {
            this.fileList = this.to.fileList.filter(file => file.fileType === this.to.documentType);
        }
        this.loadFileList(this.fileList);
        this.disableFileUpload();
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

    disableFileUpload() {
    const parentNode = this.specificUpload.wrapper;
    parentNode.children[0].style.display = 'none';
    }
}
