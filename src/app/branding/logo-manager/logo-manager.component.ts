import { Component, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { ClientSettingsService, SpaConfigService} from '@creditpoint/spa';
import { LogoService  } from '@creditpoint/spa/branding-services';

@Component({
  selector: 'app-logo-manager',
  templateUrl: './logo-manager.component.html',
  styleUrls: ['./logo-manager.component.scss']
})
export class LogoManagerComponent implements OnInit {
  resetEvent: EventEmitter<any>;

  constructor(private logoService: LogoService,
    private configService: SpaConfigService,
    private clientSettingsService: ClientSettingsService) { }

  ngOnInit() {
    this.resetEvent = this.logoService.resetEvent;
  }

  previewLogo(ev: any) {
    this.logoService.previewLogo(ev.file, ev.size);
  }

  previewSymbol(ev: any) {
    this.logoService.previewSymbol(ev.file, ev.size);
  }

  reset() {
    this.logoService.reset();
  }

  save(ev: any) {
    this.configService.overlay = true;
    this.configService.overlayMessage = 'Saving logo...';

    this.logoService.save(ev.logoFile, ev.symbolFile)
      .pipe(
        concatMap(data => this.updateClientSettings(data, ev))
      )
      .subscribe({
        complete: () => {
          this.configService.overlay = false;
          this.configService.overlayMessage = '';
        }
      });
  }

  private updateClientSettings(data: any, ev: any): Observable<any> {
    const settings = this.clientSettingsService.clientSettings;

    // Update file names if set.
    if (data.length > 0) {
      if (ev.logoFile) {
        settings.companyLogoFileName = data[0];
      }

      if (ev.symbolFile) {
        settings.companySymbolFileName = data[data.length - 1];
      }
    }

    // Only update display size if a logo has been selected
    if (ev.logoFile && ev.logoSize) {
      settings.companyLogoDisplaySize = ev.logoSize;
    }

    // Only update display size if a symbol has been selected
    if (ev.symbolFile && ev.symbolSize) {
      settings.companySymbolDisplaySize = ev.symbolSize;
    }

    return this.clientSettingsService.save();
  }
}
