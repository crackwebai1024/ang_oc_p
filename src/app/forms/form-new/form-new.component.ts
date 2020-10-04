import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientSettingsService, ClientSettings } from '@creditpoint/spa';
import { ThemeDataService } from '../../shared/services/themes.service';
import {ThemeService } from '@creditpoint/spa/branding-services';
import { Theme } from '../../shared/models/theme';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'form-new',
  templateUrl: './form-new.component.html',
  styleUrls: ['./form-new.component.scss']
})
export class FormNewComponent implements OnInit {
  templateID: any;
  clientSettings: ClientSettings;
  theme: Theme;
  constructor(
    private _route: ActivatedRoute,
    public _clientSettingsService: ClientSettingsService,
    private _router: Router,
    private themeDataService: ThemeDataService,
    private themeService: ThemeService,
    private dataService: DataService) {
   }

  ngOnInit() {
  if ((sessionStorage.getItem('creditAppID') !== null) || (sessionStorage.getItem('template-id') !== null)) {
    sessionStorage.removeItem('creditAppID');
    sessionStorage.removeItem('template-id');
    this._router.navigate(['/list']);
  } else {
    if (this._route.snapshot.params.id) {
      this.templateID = this._route.snapshot.params.id;
      sessionStorage.setItem('template-id', this.templateID.toString());
    }
    this.clientSettings = this._clientSettingsService.clientSettings;

    this.themeDataService.getThemeByTemplateID(this.templateID).subscribe({
      next: (data) => {
        this.theme = data;
       
        if (this.theme.logoFileName != null) {
          this.getImage(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`)).subscribe(logoData => {
            this.createImageFromBlob(logoData);
          });
        } else {
          if (localStorage.getItem('theme') !== null) {
            this.themeService.preview(JSON.parse(localStorage.getItem('theme')));
          }
        }
      }});
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.theme.logo = `url(${(<string>reader.result)})`;
      this.themeService.preview(this.theme);

      if (this.clientSettings.useCreditSafe) {
        this._router.navigate(['/cs/business-search']);
      } else {
        this._router.navigate(['/form']);
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

  return  this.dataService.get(imgUrl, { 'responseType': 'blob' });
  }
}
