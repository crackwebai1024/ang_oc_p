import { DesignerStep } from './designer-step';
import { DesignerDropdownList } from './designer-dropdownlist';
import { DesignerFileUpload } from './designer-file-upload';
import { DesignerItem } from './designer-item';
import { Theme } from '../../../shared/models/theme';

export class DesignerTemplate {
  public id?: number;
  public clientID?: string;
  public templateName?: string;
  public termsAndConditions?: string;
  public eSignatureRequired: boolean;
  public modifiedByUserName?: string;
  public modifiedByUserFullName?: string;
  public modifiedDate?: Date;
  public steps?: Array<DesignerStep>;
  public isActive: boolean;
  public isDeleted: boolean;
  public emailBankReferences: boolean;
  public emailTradeReferences: boolean;
  public formStyle: string;
  public dropdownLists?: Array<DesignerDropdownList>;
  public fileUpload?: DesignerFileUpload;
  public systemFields: Array<DesignerItem>;
  public status: string;
  public themeID?: string;

  constructor(clientID: string, templateName: string) {
    this.clientID = clientID;
    this.templateName = templateName;

    this.id = null;
    this.steps = new Array<DesignerStep>();
    this.modifiedDate = new Date();
    this.isActive = true;
    this.isDeleted = false;

    const designerStep: DesignerStep = new DesignerStep('New Step');
    designerStep.order = 0;
    this.steps.push(designerStep);

    this.fileUpload = new DesignerFileUpload(0, 5, 'Upload documents as instructed.');
  }
}
