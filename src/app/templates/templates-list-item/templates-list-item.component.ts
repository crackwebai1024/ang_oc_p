import { Component, OnInit, Input, EventEmitter, Output, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { Template } from '../../shared/models/template';
import { TemplateService } from '../shared/services/template.service';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'templates-list-item',
  templateUrl: './templates-list-item.component.html',
  styleUrls: ['./templates-list-item.component.scss']
})
export class TemplatesListItemComponent implements OnInit {
  @Input() template: Template;
  @Input() templateId: string;
  @Output()
  deleteClick: EventEmitter<string> = new EventEmitter<string>();
  modalRef: BsModalRef;
  message: string;
  constructor(private templateService: TemplateService, private modalService: BsModalService, private toasterService: ToasterService ) { }

  ngOnInit() {
  }

  deleteTemplate(event, template, modalTemplate: TemplateRef<any>) {
    this.modalRef = this.modalService.show(modalTemplate, {class: 'modal-sm'});
  }

  confirm(template): void {
    this.message = 'Confirmed';
     this.templateService.deleteTemplate(template.id).subscribe({
        complete: () => {
          this.deleteClick.emit(template);
        }
      });
    this.modalRef.hide();

  }

  decline(): void {
    this.message = 'Declined';
    this.modalRef.hide();
  }

  copyMessage(val: string) {
    const authInfo = JSON.parse(localStorage.getItem('auth'));
    let copyMessage: string = '';

    if (authInfo.appVersion === undefined || authInfo.locale === undefined) {
      copyMessage = 'Please contact support.';
    } else {
      copyMessage += window.location.origin;
      copyMessage += '/crdapp/' + authInfo.appVersion + '/' + authInfo.locale + '/form-new/';
      copyMessage += val;
    }

    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = copyMessage;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.toasterService.pop('success', 'Copied!', 'The link has been copied to clipboard.');
  }
}


