import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { CreditAppSummary } from '../shared/models/credit-app-summary';
import { FormsService } from '../shared/services/forms.service';

import { ToasterService } from 'angular2-toaster';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'form-list-item',
  templateUrl: './form-list-item.component.html',
  styleUrls: ['./form-list-item.component.scss']
})
export class FormListItemComponent {
  @Input() creditApp: CreditAppSummary;
  @Output() deleteTrigger = new EventEmitter();

  constructor(
    private formsService: FormsService,
    private toastr: ToasterService
  ) {}

  getCSSClass(status: string) {
    let cssClass;
    switch (status) {
      case 'Approved':
        cssClass = 'approved';
        break;
      case 'Submitted':
        cssClass = 'submitted';
        break;
      case 'Unsubmitted':
        cssClass = 'incomplete';
        break;
      case 'Pending':
        cssClass = 'pending';
        break;
      default:
        cssClass = 'pending';
        break;
    }
    return cssClass;
  }

  downloadPdf(creditAppID: string, creditAppTemplateName: string, status: string, evt: MouseEvent) {

    this.applyFileDownloadIcon(evt.target, 'downloading');
    this.formsService.downloadCreditAppPDF(creditAppID, status.toLowerCase() !== 'unsubmitted')
    .subscribe(
      data => {
        this.applyFileDownloadIcon(evt.target, 'download');
        FileSaver.saveAs(data, creditAppTemplateName + '.pdf');
      },
      error => {
        this.applyFileDownloadIcon(evt.target, 'download');
        this.toastr.pop('error', 'Error', 'An error occurred downloading the file.');
      }
    );
  }

  applyFileDownloadIcon(fileDownloadActionButton: any, action: string) {
    if (action === 'downloading') {
      fileDownloadActionButton.classList.remove('fa');
      fileDownloadActionButton.classList.remove('fa-download');

      fileDownloadActionButton.classList.add('fa');
      fileDownloadActionButton.classList.add('fa-spinner');
      fileDownloadActionButton.classList.add('fa-pulse');
      fileDownloadActionButton.title = 'Downloading...';
    } else {
      fileDownloadActionButton.classList.remove('fa');
      fileDownloadActionButton.classList.remove('fa-spinner');
      fileDownloadActionButton.classList.remove('fa-pulse');

      fileDownloadActionButton.classList.add('fa');
      fileDownloadActionButton.classList.add('fa-download');
      fileDownloadActionButton.classList.add('stop-pulse');
      fileDownloadActionButton.title = 'Download';
    }

    fileDownloadActionButton.hidden = true;
    fileDownloadActionButton.hidden = false;
  }

  downloadPDFDocusign(event) {
    const clientID = localStorage.getItem('clientId');
    this.formsService.downloadDocument(this.creditApp.id).subscribe(
      data => {
        this.applyFileDownloadIcon(event.target, 'download');
        FileSaver.saveAs(data,  this.creditApp.customerName + '.pdf');
      },
      error => {
        this.applyFileDownloadIcon(event.target, 'download');
        this.toastr.pop('error', 'Error', 'An error occurred downloading the file.');
      }

    );

  }

  deleteApplication(event) {
    const _this = this;
    this.deleteTrigger.emit({ creditApplication: _this, event});
  }
}
