import { Component, OnInit, Input } from '@angular/core';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { FieldConfigComponent } from '../../shared/models/field-config-component';
import { DocumentService } from '../../../shared/services/document.service';

@Component({
  selector: 'field-config-attachment',
  templateUrl: './field-config-attachment.component.html',
  styleUrls: ['./field-config-attachment.component.scss']
})
export class FieldConfigAttachmentComponent extends FieldConfigComponent implements OnInit {
  documentTypes: any[];
  constructor(private documentService: DocumentService) {
    super();

    this.hideDefaultValueField = true;
    this.hidePlaceholderTextField = true;
  }

  ngOnInit() {
    const _this = this;
    this.documentTypes = [];
    _this.setupModel();
    _this.setupFields();
  }

  protected setupModel() {
    super.setupModel();
  }

  protected setupFields() {
    const fields: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12',
            key: 'documentType',
            type: 'select',
            templateOptions: {
              label: 'Document Type',
              options: this.documentService.getDocumentTypes(),
              attributes: {
                class: 'form-control form-control-sm'
              }
            }
          }
        ]
      }
    ];

    super.setupFields(fields);
  }
}
