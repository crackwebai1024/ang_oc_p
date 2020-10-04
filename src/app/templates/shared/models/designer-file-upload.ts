import { SpecificUpload } from './designer-required-file-upload';

export class DesignerFileUpload {
  public minimumFiles: number;
  public maximumFiles: any;
  public instructions: string;
  public files: any[];
  public fileGroup: any;
  public specificFiles?: Array<SpecificUpload>;

  constructor(minimumFiles: number, maximumFiles: number, instructions: string) {
    this.fileGroup = {
       minimumFiles: minimumFiles,
       maximumFiles: maximumFiles
    };
    this.minimumFiles = minimumFiles;
    this.maximumFiles = maximumFiles;
    this.instructions = instructions;
    this.specificFiles = new Array<SpecificUpload>();
  }
}
