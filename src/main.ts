import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppLoader } from '@creditpoint/spa';

import { AppModule } from './app/app.module';
import { AppConfig } from './app/config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

AppLoader.load(environment, AppConfig)
  .then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.log(err));
  })
  .catch(reason => {});
