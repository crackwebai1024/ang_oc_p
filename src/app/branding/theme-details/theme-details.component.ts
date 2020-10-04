import { Component, OnInit, Input, Output, AfterContentInit, OnChanges, SimpleChange, EventEmitter, ViewChild } from '@angular/core';
import { Theme } from '../../shared/models/theme';
import { DataService } from '../../core/services/data.service';
import * as shortid from 'shortid';
import { HttpHeaders } from '@angular/common/http';
import { unescapeIdentifier } from '@angular/compiler';
import { Observable } from 'rxjs';
import { ThemeService } from '@creditpoint/spa/branding-services';

const redTheme = {
  navbarBg: '#ef5350',
  navbarBrandBg: '#e53935',
  navbarColor: '#FFFFFF',
  navbarHoverColor: '#E0E0E0',
  navbarActiveColor: '#E0E0E0',
  sidebarBg: '#E0E0E0',
  sidebarNavTitleColor: '#455A64',
  sidebarNavLinkColor: '#455A64',
  sidebarNavLinkIconColor: '#455A64',
  sidebarNavLinkHoverColor: '#FFFFFF',
  sidebarNavLinkHoverIconColor: '#FFFFFF',
  sidebarNavLinkHoverBg: '#9E9E9E',
  sidebarNavLinkActiveColor: '#FFFFFF',
  sidebarNavLinkActiveIconColor: '#e53935',
  sidebarNavLinkActiveBg: '#9E9E9E',
  sidebarMinimizerBg: '#CDCDCD',
  sidebarMinimizerHoverBg: '#A5A5A5',
  footerBg: '#E0E0E0',
  footerColor: '#455A64'
};

const purpleTheme = {
  navbarBg: '#7E57C2',
  navbarBrandBg: '#5E35B1',
  navbarColor: '#FFFFFF',
  navbarHoverColor: '#E0E0E0',
  navbarActiveColor: '#E0E0E0',
  sidebarBg: '#E8EAF6',
  sidebarNavTitleColor: '#455A64',
  sidebarNavLinkColor: '#455A64',
  sidebarNavLinkIconColor: '#455A64',
  sidebarNavLinkHoverColor: '#455A64',
  sidebarNavLinkHoverIconColor: '#455A64',
  sidebarNavLinkHoverBg: '#D1C4E9',
  sidebarNavLinkActiveColor: '#455A64',
  sidebarNavLinkActiveIconColor: '#5E35B1',
  sidebarNavLinkActiveBg: '#D1C4E9',
  sidebarMinimizerBg: '#7e57c2',
  sidebarMinimizerHoverBg: '#5e35b1',
  footerBg: '#E8EAF6',
  footerColor: '#455A64'
};

const indigoTheme = {
  navbarBg: '#3F51B5',
  navbarBrandBg: '#303F9F',
  navbarColor: '#FFFFFF',
  navbarHoverColor: '#E0E0E0',
  navbarActiveColor: '#E0E0E0',
  sidebarBg: '#E8EAF6',
  sidebarNavTitleColor: '#1A237E',
  sidebarNavLinkColor: '#1A237E',
  sidebarNavLinkIconColor: '#1A237E',
  sidebarNavLinkHoverColor: '#1A237E',
  sidebarNavLinkHoverIconColor: '#1A237E',
  sidebarNavLinkHoverBg: '#C5CAE9',
  sidebarNavLinkActiveColor: '#1A237E',
  sidebarNavLinkActiveIconColor: '#1A237E',
  sidebarNavLinkActiveBg: '#C5CAE9',
  sidebarMinimizerBg: '#3f51b5',
  sidebarMinimizerHoverBg: '#303f9f',
  footerBg: '#E8EAF6',
  footerColor: '#1A237E'
};

@Component({
  selector: 'theme-details',
  templateUrl: './theme-details.component.html',
  styleUrls: ['./theme-details.component.scss']
})

export class ThemeDetailsComponent implements OnInit, AfterContentInit, OnChanges {
  @ViewChild('editor') editor;

  private defaultFileInputLabel = 'Choose file';
  @Input() theme: Theme;
  @Input() defaultTheme: Theme;
  @Output() themeEditedEvent = new EventEmitter<void>();
  uid: any;
  sizeMin = 0;
  sizeMax = 500;
  opacityMin = 0;
  opacityMax = 100;
  opacityValue = 10;
  logoPosition = 'center center';
  fileInputLabel = this.defaultFileInputLabel;
  file: File;
  fileReader: FileReader;
  size: HTMLInputElement;
  imgPreview: HTMLInputElement;
  patternPreview: HTMLInputElement;
  opacity: HTMLInputElement;
  imgLoaded: boolean;

  constructor(private ds: DataService, private themeService: ThemeService) {
    this.uid = shortid.generate();
   }

  ngOnInit() {
    this.theme = {
        id: '',
        clientID: '',
        modifiedByUserName: '',
        modifiedDate: '',
        navbarBg: '',
        navbarBrandBg: '',
        navbarColor: '',
        navbarHoverColor: '',
        navbarActiveColor: '',
        sidebarBg: '',
        sidebarNavTitleColor: '',
        sidebarNavLinkColor: '',
        sidebarNavLinkIconColor: '',
        sidebarNavLinkHoverColor: '',
        sidebarNavLinkHoverIconColor: '',
        sidebarNavLinkHoverBg: '',
        sidebarNavLinkActiveColor: '',
        sidebarNavLinkActiveIconColor: '',
        sidebarNavLinkActiveBg: '',
        sidebarMinimizerBg: '',
        sidebarMinimizerHoverBg: '',
        footerBg: '',
        footerColor: '',
        logoFileName: '',
        logoPatternSize: '',
        logoPatternOpacity: '.1',
        logoAlignment: 'center center',
        active: '',
        displayName: '',
        isEdited: false,
        logo: '',
        bodyCustomCSS:''
    };
    // Initialize file reader used for uploaded file.
    this.fileReader = new FileReader();
    this.fileReader.onload = () => this.previewFile();
  }

  ngAfterContentInit(): void {
    // Give the DOM a chance to catch up since we dynamically set ids with uid.
    setTimeout(() => {
      // Initialize reference to specific elements after render.
      this.size = <HTMLInputElement>document.querySelector(`#size-${this.uid}`);
      this.opacity = <HTMLInputElement>document.querySelector(`#opacity-${this.uid}`);
      this.imgPreview = <HTMLInputElement>document.querySelector(`#preview-${this.uid}`);
      this.patternPreview = <HTMLInputElement>document.querySelector(`#pattern-${this.uid}`);
      this.imgPreview.style.backgroundSize = `auto 100px`; // `${this.theme.logoDisplaySize}px`;
    }, 1000);
  }
  
  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    const log: string[] = [];
    // tslint:disable-next-line: forin
    for (const propName in changes) {
      const changedProp = changes[propName];
      const to = JSON.stringify(changedProp.currentValue);

      if (changedProp.isFirstChange()) {
        log.push(`Initial value of ${propName} set to ${to}`);
      } else {
        if (propName === 'theme') {
          if (this.theme.logoFileName !== '') {
            this.imgLoaded = true;
            this.getImageFromService(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`));
          } else {
            this.imgLoaded = false;
            this.imgPreview.style.backgroundImage = `url()`;
            this.patternPreview.style.backgroundImage = `url()`;
          }
        }
        const from = JSON.stringify(changedProp.previousValue);
        log.push(`${propName} changed from ${from} to ${to}`);
      }
    }
  }

  previewTheme() {
    this.getImage(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`)).subscribe(data => {
      this.createImageFromBlob(data);
    });
    this.themeService.preview(this.theme);
  }

  resetTheme() {
    window.location.reload();
  }

  saveTheme() {
    if (this.file === undefined) {
      this.uploadTheme();
    } else {
      this.uploadLogo();
    }
  }

  uploadLogo() {
    const formData: FormData = new FormData();
    formData.append('file', this.file, this.file.name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };
    this.ds.post(DataService.getParsedEndPointTpl('api/Files/UploadFile'), formData, httpOptions).subscribe({
      next: (data) => {
        const fileName: string = data;
        this.theme.logoFileName = fileName;
        this.uploadTheme();
      }});
  }

  uploadTheme() {
    this.ds.put(DataService.getParsedEndPointTpl('api/Themes'), this.theme).subscribe({
      next: (data) => {
        this.theme.isEdited = false;
      }
    });
  }

  loadExample(ev: any) {
    ev.preventDefault();

    switch (ev.target.dataset.theme) {
      case 'default':
        Object.assign(this.theme, {
          navbarBg: this.defaultTheme.navbarBg,
          navbarBrandBg: this.defaultTheme.navbarBrandBg,
          navbarColor: this.defaultTheme.navbarColor,
          navbarHoverColor: this.defaultTheme.navbarHoverColor,
          navbarActiveColor: this.defaultTheme.navbarActiveColor,
          sidebarBg: this.defaultTheme.sidebarBg,
          sidebarNavTitleColor: this.defaultTheme.sidebarNavTitleColor,
          sidebarNavLinkColor: this.defaultTheme.sidebarNavLinkColor,
          sidebarNavLinkIconColor: this.defaultTheme.sidebarNavLinkIconColor,
          sidebarNavLinkHoverColor: this.defaultTheme.sidebarNavLinkHoverColor,
          sidebarNavLinkHoverIconColor: this.defaultTheme.sidebarNavLinkHoverIconColor,
          sidebarNavLinkHoverBg: this.defaultTheme.sidebarNavLinkHoverBg,
          sidebarNavLinkActiveColor: this.defaultTheme.sidebarNavLinkActiveColor,
          sidebarNavLinkActiveIconColor: this.defaultTheme.sidebarNavLinkActiveIconColor,
          sidebarNavLinkActiveBg: this.defaultTheme.sidebarNavLinkActiveBg,
          sidebarMinimizerBg: this.defaultTheme.sidebarMinimizerBg,
          sidebarMinimizerHoverBg: this.defaultTheme.sidebarMinimizerHoverBg,
          footerBg: this.defaultTheme.footerBg,
          footerColor: this.defaultTheme.footerColor,
          logoFileName: this.defaultTheme.logoFileName,
          logoPatternSize: this.defaultTheme.logoPatternSize,
          logoPatternOpacity: this.defaultTheme.logoPatternOpacity,
          logoAlignment: this.defaultTheme.logoAlignment
      });
        break;

      case 'indigo':
        Object.assign(this.theme, indigoTheme);
        break;

      case 'red':
        Object.assign(this.theme, redTheme);
        break;

      case 'purple':
        Object.assign(this.theme, purpleTheme);
        break;
    }

    this.themeEditedEvent.emit();
    this.theme.isEdited = true;
  }

  onFileChange(input: HTMLInputElement) {
    this.file = input.files[0];
    this.fileInputLabel = this.file.name;
    this.fileReader.readAsDataURL(this.file);
  }

  changeSizeEvent(value: number, type: string) {
    switch (type) {
      case 'opacity' :
          this.opacityValue = value;
          const opacityDecimal: number = this.opacityValue / 100;
          this.patternPreview.style.opacity = `${opacityDecimal}`;
          this.theme.logoPatternOpacity = opacityDecimal.toString();
      break;
      case 'size' :
          this.patternPreview.style.backgroundSize = `${value}px`;
          this.theme.logoPatternSize = `${value}px`;
      break;
    }

    this.themeEditedEvent.emit();
    this.theme.isEdited = true;
  }

  alignLogoEvent(value: string) {
    this.theme.logoAlignment = value;
    this.imgPreview.style.backgroundPosition = this.theme.logoAlignment;
    this.themeEditedEvent.emit();
    this.theme.isEdited = true;
  }

  previewFile() {
    const base64data = <string>this.fileReader.result;
    this.imgPreview.style.backgroundImage = `url(${base64data})`;
    this.imgPreview.style.backgroundPosition = this.logoPosition;
    this.imgPreview.style.backgroundSize = `auto 100px`;
    this.patternPreview.style.backgroundImage = `url(${base64data})`;
    this.imgLoaded = true;
  }

  onColorSelect() {
    this.themeEditedEvent.emit();
    this.theme.isEdited = true;
  }

  displayNameKeydownEvent(event: Event) {
    this.themeEditedEvent.emit();
    this.theme.isEdited = true;
  }

  getImageFromService(imgUrl: string) {
    this.getImage(imgUrl).subscribe(data => {
      this.createImageFromBlob(data);
    });
  }

  createImageFromBlob(image: Blob) {
     const reader = new FileReader();
     reader.addEventListener('load', () => {
      if (this.imgPreview != null) {
        this.imgPreview.style.backgroundImage = `url(${(<string>reader.result)})`;
        this.imgPreview.style.backgroundPosition = this.theme.logoAlignment;
        this.imgPreview.style.backgroundSize = `auto 100px`;
        this.patternPreview.style.backgroundImage = `url(${(<string>reader.result)})`;
        this.patternPreview.style.opacity = this.theme.logoPatternOpacity;
        this.patternPreview.style.backgroundSize = this.theme.logoPatternSize ? `${this.theme.logoPatternSize}` : `auto`;
        this.theme.logo = `url(${(<string>reader.result)})`;
        this.opacityValue = this.theme.logoPatternOpacity ? +this.theme.logoPatternOpacity * 100 : 10;
      } else {
        setTimeout(() => {
          this.imgPreview.style.backgroundImage = `url(${(<string>reader.result)})`;
          this.imgPreview.style.backgroundPosition = this.theme.logoAlignment;
          this.patternPreview.style.backgroundImage = `url(${(<string>reader.result)})`;
          this.patternPreview.style.opacity = this.theme.logoPatternOpacity;
          this.patternPreview.style.backgroundSize = this.theme.logoPatternSize ? `${this.theme.logoPatternSize}` : `auto`;
          this.theme.logo = `url(${(<string>reader.result)})`;
          this.opacityValue = this.theme.logoPatternOpacity ? +this.theme.logoPatternOpacity * 100 : 10;
        }, 1000);
      }
     }, false);

     if (image) {
        reader.readAsDataURL(image);
     }
  }
   getImage(imgUrl: string): Observable<Blob> {
    const httpOptions = {
      headers: new HttpHeaders({
        'responseType': 'blob'
      })};

    return  this.ds.get(imgUrl, { 'responseType': 'blob' });
   }
}

