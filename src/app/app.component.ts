import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SpaConfigService } from '@creditpoint/spa';
import { ToasterConfig } from 'angular2-toaster';
import * as queryString from 'query-string';

@Component({
  // tslint:disable-next-line
  selector: 'app-root',
  template: `
  <focus></focus>
  <div id="background-print"></div>
  <toaster-container [toasterconfig]="config"></toaster-container>
  <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  initialLoadComplete = false;
  public config: ToasterConfig = new ToasterConfig({
    animation: 'fade',
    tapToDismiss: true,
    mouseoverTimerStop: true,
    positionClass: 'toast-top-center',
    showCloseButton: true,
    timeout: 2500
  });

  constructor(private router: Router, private configService: SpaConfigService) { }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);

      // Turn off overlay once app has rendered on initial load.
      if (!this.initialLoadComplete) {
        setTimeout(() => {
          const query = queryString.parse(window.location.search);
          if (query.loadingMessageType !== 'docusign') {
            this.configService.overlay = false;
          }
          this.initialLoadComplete = true;
        }, 1000);
      }
    });

    /**
     * When user logout promise resolves, clear storage and redirect user to root of the
     * application. That will trigger the AuthGuard to kick in and redirect to login.
     */
    this.configService.onUserLogout()
      .then(() => {
        // Clear all storage
        localStorage.clear();

        // Reload app at root triggering redirect to authentication minus any app routes.
        const routeUrl = this.router.url;
        const redirectUrl = location.href.replace(routeUrl, '/');
        location.replace(redirectUrl);
      });

    // Handle reset password requests via Observable.
    this.configService.resetPasswordState.subscribe({
      next: reset => {
        if (reset) {
          this.router.navigate(['/password-reset']);
        }
      }
    });
  }
}
