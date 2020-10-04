export class SpecificUpload {
  public fileType: string;
  public isRequired: boolean;

  constructor(fileType: string, isRequired: boolean) {
    this.fileType = fileType;
    this.isRequired = isRequired;
  }
}
