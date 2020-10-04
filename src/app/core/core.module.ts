import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from '@creditpoint/spa';

/* Route Resolvers */
import { CountryResolver } from './resolvers/country.resolver';
import { StateResolver } from './resolvers/state.resolver';

/* Services */
import { DataService } from './services/data.service';
import { FilesService } from './services/files.service';
import { LookupService } from './services/lookup.service';
import { TemplateMappingService } from './services/template-mapping.service';
import { UserService } from './services/user.service';
import { TokenService } from './services/token.service';

@NgModule({
  imports: [
    CommonModule
  ]
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule = null) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        CountryResolver,
        StateResolver,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        },
        DataService,
        FilesService,
        LookupService,
        TemplateMappingService,
        UserService,
        TokenService
      ]
    };
  }
}

