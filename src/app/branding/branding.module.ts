import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpaBrandingModule } from '@creditpoint/spa/branding';
import { ColorPickerModule } from 'ngx-color-picker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap';

// Import components
import { LogoManagerComponent } from './logo-manager/logo-manager.component';
import { ThemeManagerComponent } from './theme-manager/theme-manager.component';

// Import routing
import { BrandingRoutingModule } from './branding.routing';
import { ThemeListComponent } from './theme-list/theme-list.component';
import { ThemeDetailsComponent } from './theme-details/theme-details.component';

// Services
import { ThemeDataService } from '../shared/services/themes.service';
import { ThemeService } from '@creditpoint/spa/branding-services';

import { AceEditorModule } from 'ng2-ace-editor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SpaBrandingModule,
    BrandingRoutingModule,
    ColorPickerModule,
    BsDropdownModule,
    TabsModule.forRoot(),
    AceEditorModule
  ],
  declarations: [
    LogoManagerComponent,
    ThemeManagerComponent,
    ThemeListComponent,
    ThemeDetailsComponent
  ],
  providers: [
    ThemeDataService,
    ThemeService
  ]
})
export class BrandingModule { }
