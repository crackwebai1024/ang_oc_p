import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ClientSettings, SpaConfigService } from '@creditpoint/spa';
import * as FileSaver from 'file-saver';

import { FormsService } from '../shared/services/forms.service';
import { CreditAppSummary } from '../shared/models/credit-app-summary';
import { User } from '../../shared/models/user';
import { Template } from '../../shared/models/template';
import { ThemeService } from '@creditpoint/spa/branding-services';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'form-list',
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  templates: Template[];
  title = 'My Credit Apps';
  creditApps: Array<CreditAppSummary> = [];
  clientSettings: ClientSettings;
  deletedItem: any = {};
  modalRef: BsModalRef;
  @ViewChild('modalTemplate') modalTemplate: ElementRef;

  constructor(
    private formsService: FormsService,
    private router: Router,
    private authService: AuthService,
    private configService: SpaConfigService,
    private themeService: ThemeService,
    private modalService: BsModalService) {}

  ngOnInit() {
    // angular bootstrap bug adds tooltip to the top of the page;
    const element = document.getElementsByClassName('tooltip')[0];
    if (element !== undefined) {
      element.parentNode.removeChild(element);
    }

    sessionStorage.removeItem('creditAppID');
    sessionStorage.removeItem('template-id');

    if (localStorage.getItem('linkedTemplateUrl') !== null) {
      this.templates = (<User>this.authService.user).associatedTemplates.filter(function(item) {
        return item.id === localStorage.getItem('linkedTemplateUrl');
      });
    } else {
      this.templates = (<User>this.authService.user).associatedTemplates;
    }

    if (localStorage.getItem('theme') !== null) {
      this.themeService.preview(JSON.parse(localStorage.getItem('theme')));
    }

    this.loadCreditApps();
  }

  deleteTrigger(data) {
    const event = data.event;
    const creditApp = data.creditApplication.creditApp;
    event.target.classList.remove('fa-trash');
    event.target.classList.add('fa-spinner');
    event.target.classList.add('fa-pulse');
    this.deletedItem = {
      name: creditApp.customerName,
      id: creditApp.id,
      event: event
    };

    this.modalRef = this.modalService.show(this.modalTemplate);
  }

  confirmDelete() {
    this.modalRef.hide();
    this.formsService.deletCreditApp(this.deletedItem.id).subscribe({next: () => {
      this.loadCreditApps();
    }});
  }

  declineDelete() {
    this.deletedItem.event.target.classList.add('fa-trash');
    this.deletedItem.event.target.classList.remove('fa-spinner');
    this.deletedItem.event.target.classList.remove('fa-pulse');
    this.deletedItem = {};
    this.modalRef.hide();
  }

  private loadCreditApps(): void {
    this.formsService.getCreditApps()
      .subscribe({
        next: data => {
          this.updateStatus(data);
          this.creditApps = data.filter(app => app.status.toLowerCase() !== 'deleted');
        },
        error: error => console.log(error)
      });
  }

  updateStatus(data) {
    for (const record of data) {
      record.status = record.status || 'Unsubmitted';
      record.statusDisplayName = record.status;
      if (record.status.toLowerCase() === 'unsubmitted') {
        record.statusDisplayName = 'Incomplete';
      }
    }
  }

  downloadPdf(templateID: string, templateName: string, evt: MouseEvent) {
    this.configService.overlayMessage = 'Downloading credit application. Please wait...';
    this.configService.overlay = true;
    this.formsService.downloadBlankCreditAppPDF(templateID)
    .subscribe(
      data => {
        FileSaver.saveAs(data, templateName + '.pdf');
        this.configService.overlay = false;
      },
      error => {
        console.log(error);
        this.configService.overlay = false;
      }
    );
  }
}
