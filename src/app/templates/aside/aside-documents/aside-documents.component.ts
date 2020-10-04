import { Component, OnInit, Input } from '@angular/core';
import { AsideService } from '../../shared/services/aside.service';
import { DesignerStepComponent } from '../../designer/designer-step/designer-step.component';
import { DocumentTypeModel } from '../../shared/models/document-type.model';
import { SpecificUpload } from '../../shared/models/designer-required-file-upload';

@Component({
  selector: 'cap-aside-documents',
  templateUrl: './aside-documents.component.html',
  styleUrls: ['./aside-documents.component.scss']
})
export class AsideDocumentsComponent implements OnInit {

  gridData: any[];
  currentTemplateDocs: SpecificUpload[];
  @Input() designerInstance: DesignerStepComponent;

  constructor(private _asideService: AsideService) {
    this.currentTemplateDocs = null;
    this._asideService.currentDependancy.subscribe((data: SpecificUpload[]) => {
      this.currentTemplateDocs = data;
    });
  }

  ngOnInit() {
    this._asideService.getDocumentTypes().subscribe({
      next: (data) => {
        const docTypes: DocumentTypeModel[] = [];
        const templateDocs: String[] = (this.currentTemplateDocs !== null) ? this.currentTemplateDocs.map(u => u.fileType) : [];
        data.forEach(function(item) {
          docTypes.push({
            DocumentType: item.documentType,
            Selected: templateDocs.includes(item.documentType)
          });
        });
        this.gridData = docTypes;
      },
      error: () => {
        console.warn('Getting documents faild. Please check if CPX api is connected.');
      }
    });
  }

  checkboxClickEvent(index: any, selected: any) {
    this.gridData[index].Selected = selected;
    if (selected) {
      this._asideService.addDocumentDependancy(this.gridData[index]);
    } else {
      this._asideService.removeDocumentDependancy(this.gridData[index]);
    }
  }
}
