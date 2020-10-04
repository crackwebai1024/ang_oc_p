import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SpaConfigService, ClientSettingsService, ClientSettings } from '@creditpoint/spa';

import { FormsService } from '../shared/services/forms.service';
import { AsideService } from '../../templates/shared/services/aside.service';
import { TemplateMappingService } from '../../core/services/template-mapping.service';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

@Component({
  selector: 'cap-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input()
  creditApp: any;
  @Input()
  signature: any;

  creditAppID: string;
  systemFields: Array<any>;
  termsAndConditions: string;
  docuSignEventStatus: string;
  docuSignEnvelopeID: string;
  form = new FormGroup({});
  model: any = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];
  clientSettings: ClientSettings;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formsService: FormsService,
    private configService: SpaConfigService,
    private toaster: ToasterService,
    private clientSettingsService: ClientSettingsService) { }

  ngOnInit() {
    this.creditAppID = this.creditApp.id;

    this.model = Object.assign(this.creditApp, {
      termsAndConditions: this.creditApp.termsAndConditions,
      agree: this.creditApp.status.toLowerCase() !== 'unsubmitted',
      signature: this.signature
    });

    this.systemFields = this.creditApp.systemFields;

    this.clientSettings = this.clientSettingsService.clientSettings;

    this.creditApp.eSignatureRequired = (this.clientSettings.useDocusign && this.creditApp.eSignatureRequired) || false;

    this.route.queryParams
      .pipe(
        filter(params => params.event)
      )
      .subscribe(params => {
        this.docuSignEventStatus = params.event;
      });

    this.route.queryParams
      .pipe(
        filter(params => params.envelopeID)
      )
      .subscribe(params => {
        this.docuSignEnvelopeID = params.envelopeID;
      });

    if (this.docuSignEventStatus !== undefined) {
      if (this.docuSignEventStatus === 'signing_complete') {
        this.submitCreditApplication();
      } else {
        this.toaster.pop('error', 'Submission Failed', 'The credit application failed to submit.');
        this.router.navigate(['/list']);
      }
    }

    this.fields = [
      {
        key: 'termsAndConditions',
        type: 'textarea',
        templateOptions: {
          label: null,
          rows: 10,
          disabled: true
        }
      },
      {
        key: 'agree',
        type: 'checkbox',
        defaultValue: false,
        templateOptions: {
          label: 'I agree to the terms and conditions',
          required: true,
          disabled: this.creditApp.status.toLowerCase() !== 'unsubmitted'
        }
      },
      {
        key: 'signature',
        type: 'input',
        templateOptions: {
          label: 'Enter Full Name',
          required: true,
          disabled: this.creditApp.status.toLowerCase() !== 'unsubmitted'
        },
        className: 'signature-italics'
      }
    ];
  }

  submit() {
    if (this.form.valid) {
      // If configured for DocuSign, engage signing ceremony and return from function.
      if (this.creditApp.eSignatureRequired && this.clientSettings.useDocusign) {
        const user = JSON.parse(localStorage.getItem('user'));
        this.getDocuSignRecipientView(user.firstName + ' ' + user.lastName, user.emailAddress);
        return;
      }

      // Otherwise, just submit the credit application.
      this.submitCreditApplication();
    }
  }

  appendMissingFields() {
    const currentItemCount: number = this.creditApp.steps[0].sections[0].items.length;
    return new Observable(obs => {
      this.configService.overlay = true;
      this.configService.overlayMessage = 'Processing, please wait...';
      this.systemFields.forEach(systemField => {
        if (!this.isSystemFieldPresentInCreditApp(systemField.name)) {
          systemField.type = this.mapCreditAppFieldTypes(systemField.type);
          if (systemField.type === 'FieldGroup' || systemField.type === 'MultipleFieldGroup') {
              systemField.fields.forEach(item => {
              item.type = this.mapCreditAppFieldTypes(item.type);
              item.defaultValue = null;
            });
          }
          this.creditApp.steps[0].sections[0].items.push(systemField);
        }
      });

      this.creditApp.steps[0].sections[0].items.push({
        value: this.form.value.signature,
        type: 'StringText',
        displayName: 'Signature',
        name: 'signature',
        order: currentItemCount + 1,
        isRequired: this.creditApp.eSignatureRequired
      });

      if (this.creditApp.eSignatureRequired && this.clientSettings.useDocusign) {
        this.creditApp.docuSignEnvelopeID = this.docuSignEnvelopeID;
      }

      this.formsService.updateCreditApp(this.creditApp.id, this.creditApp)
        .subscribe({
          next: updateResult => {
            this.configService.overlay = false;
            obs.next(updateResult);
          }
        });
    });
  }

  mapCreditAppFieldTypes(fieldType) {
    let creditAppFieldType: string;
    switch (fieldType.toLowerCase()) {
      case 't_stringtext':
        creditAppFieldType = 'StringText';
        break;
      case 't_stringdropdown':
        creditAppFieldType = 'StringDropDown';
        break;
      case 't_floattext':
        creditAppFieldType = 'FloatText';
        break;
      case 't_intdropdown':
        creditAppFieldType = 'IntDropDown';
        break;

      case 't_fieldgroup':
        creditAppFieldType = 'FieldGroup';
        break;

        case 't_multiplefieldgroup':
        creditAppFieldType = 'MultipleFieldGroup';
        break;
    }

    return creditAppFieldType;
  }

  private isSystemFieldPresentInCreditApp(fieldName: string): boolean {
    for (let x = 0; x < this.creditApp.steps.length; x++) {
      for (let y = 0; y < this.creditApp.steps[x].sections.length; y++) {
        for (let z = 0; z < this.creditApp.steps[x].sections[y].items.length; z++) {
          const item = this.creditApp.steps[x].sections[y].items[z];
          if (item.name === fieldName) {
            return true;
          } else if (item.items !== undefined && item.items !== null && item.items.length > 0) {
            for (let i = 0; i < item.items.length; i++) {
              const childItem = item.items[i];
              if (childItem.name === fieldName) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  submitCreditApplication() {
    this.appendMissingFields()
      .subscribe({
        next: (data) => {
          this.configService.overlay = true;
          this.configService.overlayMessage = 'Credit application is being submitted. Please wait...';
          this.formsService.submitCreditApp(this.creditAppID)
            .subscribe({
              next: submitResult => {
                  this.configService.overlay = false;
                  this.toaster.pop('success', 'Submitted', 'The credit application has been submitted.');
                  this.router.navigate(['/list']);
                },
                error: err => {
                  this.configService.overlay = false;
                  this.toaster.pop('error', 'Submission Failed', 'The credit application failed to submit.');
                  this.router.navigate(['/list']);
                }
            });
        }
      });
  }

  getDocuSignRecipientView(name: string, email: string) {
    this.configService.overlay = true;
    this.configService.overlayMessage = 'Engaging DocuSign signing ceremony. Please wait...';
    let htmlDocument: string = '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Terms and Conditions</title></head><body><p>';
    htmlDocument += this.termsAndConditions;
    htmlDocument += '</p><p>Sign here: _______________________________</p></body></html>';

    this.formsService.getDocuSignRecipientView(name, email, location.href, this.creditAppID, htmlDocument)
      .subscribe(data => {
        location.replace(data);
      });
  }
}
