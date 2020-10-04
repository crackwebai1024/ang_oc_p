import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { SpaApplicationModule } from '@creditpoint/spa';
import { SpaBrandingServicesModule } from '@creditpoint/spa/branding-services';
import { ToasterModule } from 'angular2-toaster';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';

/* App Initializer */
import { AppInitializer } from './app-initializer';

/* App Root */
import { AppComponent } from './app.component';

/* Feature Modules */
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

/* Routing Module */
import { AppRoutingModule } from './app.routing';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SpaApplicationModule.forRoot(),
    SpaBrandingServicesModule.forRoot(),
    ToasterModule.forRoot(),
    ModalModule.forRoot(),
    CoreModule.forRoot(),
    SharedModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent
  ],
  providers: [
    AppInitializer,
    {
      provide: APP_INITIALIZER,
      useFactory: (app: AppInitializer) => () => app.init(),
      deps: [AppInitializer],
      multi: true
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
