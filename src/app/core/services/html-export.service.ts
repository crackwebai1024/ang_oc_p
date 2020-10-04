import { Injectable } from '@angular/core';
// import * as jspdf from 'jspdf';
// import html2canvas from 'html2canvas';

@Injectable()
export class HTMLExportService {
  private elements: any;
  private pdfs: any;

  constructor() { }

  cloneElementWithStyles(name: string, sourceElement: HTMLElement, destinationElement: HTMLElement = null): void {
    const sourceElementChildStyles: CSSStyleDeclaration = window.getComputedStyle(sourceElement);
    if (destinationElement === null) {
      destinationElement = <HTMLElement>sourceElement.cloneNode(true);
    }

    for (const cssProperty of Object.keys(sourceElementChildStyles)) {
      destinationElement.style[cssProperty] = sourceElementChildStyles.getPropertyValue(cssProperty);
    }

    if (destinationElement.hasChildNodes()) {
      for (let i: number = 0; i < destinationElement.childNodes.length; i++) {
        const childNode = destinationElement.childNodes.item(i);
        if (childNode instanceof Element) {
          this.cloneElementWithStyles(null, <HTMLElement>sourceElement.childNodes.item(i), <HTMLElement>destinationElement.childNodes.item(i));
        }
      }
    }

    if (this.elements === undefined) {
      this.elements = {};
    }

    this.elements[name] = destinationElement;
  }

  generatePDFFromElement(name: string, sourceElement: HTMLElement): void {
    // html2canvas(sourceElement).then(canvas => {
    //   const imgWidth = 208;
    //   const pageHeight = 400;
    //   const imgHeight = canvas.height * imgWidth / canvas.width;
    //   const heightLeft = imgHeight;

    //   const contentDataURL = canvas.toDataURL('image/png');
    //   const pdf = new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
    //   const position = 0;
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
    //   // pdf.text('blahblahblah');
    //   const pdfString = pdf.output('blob');
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     if (this.pdfs === undefined) {
    //       this.pdfs = {};
    //       const base64String: string = reader.result;
    //       this.pdfs[name] = base64String.substr(base64String.indexOf(',') + 1);
    //     }
    //   };
    //   reader.readAsDataURL(pdfString);
    //   // pdf.save('MYPdf.pdf'); // Generated PDF

    //   // if (this.pdfs === undefined) {
    //   //   this.pdfs = {};
    //   // }

    //   // this.pdfs[name] = pdfString;
    // });
  }

  getClonedElement(name: string): any {
    return this.elements[name];
  }

  getBlob(name: string): any {
    return this.pdfs[name];
  }
}
