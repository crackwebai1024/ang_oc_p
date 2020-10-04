import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService, ErrorService, SpaConfigService, ClientSettingsService, ClientSettings, NavItem, AuthUser } from '@creditpoint/spa';
import { LogoService, ThemeService } from '@creditpoint/spa/branding-services';
import { Util } from '@creditpoint/util';
import { Observable, forkJoin } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import * as queryString from 'query-string';

import { AppConfig, SpaConfig } from './config';
import { DataService } from './core/services/data.service';
import { UserService } from './core/services/user.service';
import { User } from './shared/models/user';
import { RoleType } from './shared/models/role-type';
import { _ } from './shared/lodash-extensions';
import { Theme } from './shared/models/theme';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class AppInitializer {
  continueParam = `continue=${location.href}`;
  authenticationUrl = `${AppConfig.authUrl}?${this.continueParam}`;
  authentication0Url = `${AppConfig.auth0Url}?${this.continueParam}`;
  userService: UserService;
  dataService: DataService;
  user: User;
  theme: Theme;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private errorService: ErrorService,
    private configService: SpaConfigService,
    private clientSettingsService: ClientSettingsService,
    private logoService: LogoService,
    private themeService: ThemeService) {
  }

  init(): Promise<any> {
    
    return new Promise((resolve, reject) => {
      this.disableBrowserWindowDragDropEvents();
      if (location.href.indexOf('auth0') !== -1) {
        if (location.href.indexOf('continue') !== -1) {
            let origin = window.location.href.split('?')[0].replace("auth0","");
            const urlParams = new URLSearchParams(window.location.search);
            let _continue = urlParams.get('continue');
            this.authenticationUrl = `${AppConfig.auth0Url}?continue=${origin}`;
            if(_continue != null){
              this.authenticationUrl += `/${_continue}`;
            }
        }else{
          this.authenticationUrl = this.authentication0Url;
        }
      }
      // Check that user has logged in and has a valid token
      if (!Util.isEmpty(this.authService.auth)) {

        if (this.authService.isTokenValid()) {
          // TODO: If dependency data fails to load for any reason, redirect to authentication.
          try {
            this.loadDependencies()
              .subscribe({
                complete: () => {
                  this.authService.user = this.user;

                  if (location.href.indexOf('form-new') !== -1) {
                    const linkedTemplateUrl = location.href.split('form-new/')[1];
                    localStorage.setItem('linkedTemplateUrl', linkedTemplateUrl);
                  }

                  this.configureSpaApp(this.user);

                  const navUrl = this.applyUserRoutingLogic(this.user);
                  localStorage.setItem('userFirstRoute', JSON.stringify(navUrl));

                  resolve();
                },
                error: (e) => reject(e)
              });
          } catch (e) {
            reject(e);
          }

        } else {
          // Otherwise, redirect to authentication.
          localStorage.removeItem('auth'); // remove just in case
          location.replace(this.authenticationUrl);

          reject('Token invalid.');
        }

      } else {
        // Otherwise, redirect to authentication.
        localStorage.removeItem('auth'); // remove just in case
        location.replace(this.authenticationUrl);
        reject('User not authenticated.');
      }
    
    });
  }

  private loadDependencies(): Observable<any> {
    const loaders = new Array();
    loaders.push(this.loadUser());
    loaders.push(this.loadClientTheme());
    loaders.push(this.loadClientSettings());

    return forkJoin(loaders)
      .pipe(
        map(data => {
          this.user = <User> data[0];
          this.theme = <Theme>data[1];
          this.getImage(DataService.getParsedEndPointTpl(`api/Files/DownloadFile?fileName=${this.theme.logoFileName}&friendlyName=${this.theme.logoFileName}`)).subscribe(logoData => {
            this.createImageFromBlob(logoData);
          });
          return data[2];
        })
      );
  }

  private loadUser(): Observable<User> {
    /**
     * We create a local instance of UserService instead of using dependency injection.
     * If we use DI, it calls UserService constructor which tries to initialize end points.
     * If auth is not defined, in cases of user logout and reload app to redirect, UserService
     * will throw an error. This local instance avoids error and still provides use.
     */
    // this.userService = new UserService(this.http);
    this.userService = new UserService(new DataService(this.http));
    return this.userService.getCurrentUser();
  }

  private loadClientTheme(): Observable<any> {
    // Set default theme
    const defaultTheme = {
      id: -1,
      navbarBg: '#06537d',
      navbarBrandBg: '#044162',
      navbarColor: '#ffffff',
      navbarHoverColor: '#f8f8f8',
      navbarActiveColor: '#f5f5f5',
      sidebarBg: '#e4e6eb',
      sidebarNavTitleColor: '#383e4b',
      sidebarNavLinkColor: '#383e4b',
      sidebarNavLinkIconColor: '#9ba3b4',
      sidebarNavLinkHoverColor: '#383e4b',
      sidebarNavLinkHoverIconColor: '#4e5668',
      sidebarNavLinkHoverBg: '#d2d6de',
      sidebarNavLinkActiveColor: '#383e4b',
      sidebarNavLinkActiveIconColor: '#06537d',
      sidebarNavLinkActiveBg: '#d2d6de',
      sidebarMinimizerBg: '#044162',
      sidebarMinimizerHoverBg: '#03314a',
      footerBg: '#e4e6eb',
      footerColor: '#678898',
      logoFileName: '',
      logoDisplaySize: '',
      active: true,
      themeID: '',
      displayName: 'default'
    };
    this.themeService.defaultTheme = defaultTheme;

    // Load client theme
    return this.http.get(DataService.getParsedEndPointTpl(AppConfig.themesPath));
  }

  private loadClientSettings(): Observable<any> {
    this.clientSettingsService.endpoint = DataService.getParsedEndPointTpl(AppConfig.clientSettingsPath);
    return this.clientSettingsService.load();
  }

  private loadClientLogo(settings: ClientSettings): Observable<any> {
    // this.logoService.logoFileName = settings.companyLogoFileName;
    // this.logoService.logoDisplaySize = settings.companyLogoDisplaySize;
    this.logoService.symbolFileName = settings.companySymbolFileName;
    this.logoService.symbolDisplaySize = settings.companySymbolDisplaySize;
    this.logoService.downloadEndpoint = DataService.getParsedEndPointTpl(AppConfig.fileDownloadPath);
    this.logoService.uploadEndpoint = DataService.getParsedEndPointTpl(AppConfig.fileUploadPath);
    return this.logoService.load();
  }

  private configureSpaApp(user: User) {
    // Turn on SPA overlay in case it's not already on
    this.configService.overlay = true;
    this.configService.overlayMessage = this.getLoadingMessageForUser(user);

    // Configure remaining SPA settings
    this.configService.authUrl = AppConfig.authUrl;
    this.configService.headerNavigation = this.getHeaderNavForUser(user);
    this.configService.sidebarNavigation = this.getSidebarNavForUser(user);
    this.configService.footerLeft = SpaConfig.footerLeft;
    this.configService.footerRight = SpaConfig.footerRight;
  }

  private getLoadingMessageForUser(user: User): string {
    let loadingMessage = 'Loading application...';
    let loadingMessageType = null;

    const query = queryString.parse(window.location.search);
    if (query.loadingMessageType !== null && query.loadingMessageType !== undefined) {
      loadingMessageType = query.loadingMessageType;
    }

    if (loadingMessageType === 'docusign') {
      loadingMessage = 'Completing DocuSign process. Please wait...';
    } else if (user.roles.length > 0 && user.roles.includes(RoleType.User)) {
      loadingMessage = 'Loading credit application...';
    }

    return loadingMessage;
  }

  private getHeaderNavForUser(user: User): NavItem[] {
    let headerNavItems: NavItem[] = [];

    user.roles.forEach((role, ri, roles) => {
      const headerNav = _.find(SpaConfig.headerNavs, {name: role});
      if (!Util.isEmpty(headerNav)) {
        headerNavItems = headerNavItems.concat(headerNav.navItems);
      }
    });

    return headerNavItems;
  }

  private getSidebarNavForUser(user: User): NavItem[] {
    let sidebarNavItems: NavItem[] = [];

    user.roles.forEach((role, ri, roles) => {
      const sideNav = _.find(SpaConfig.sideNavs, {name: role});
      if (!Util.isEmpty(sideNav)) {
        sidebarNavItems = sidebarNavItems.concat(sideNav.navItems);
      }
    });

    return sidebarNavItems;
  }

  private applyUserRoutingLogic(user: User): string | Array<any> {
    /**
     * Backend role routes.
     */
    const templateDesigner = '/templates/list';
    const adminUserList = '/admin/users';

    /* User role routes */
    const creditAppList = '/list';
    const creditAppForm = '/form-new';
    const errorPage = '/error';
    const creditAppAdminList = '/creditapps';
    let navUrl: string | Array<any>;

    // TESTING ONLY
    // user.associatedTemplates = [];
    // user.associatedTemplates = null;
    // user.previousCreditApplication = false;
    // user.associatedTemplates = [user.associatedTemplates[0]];
    
    if (user.roles.length > 0 && (user.roles.includes(RoleType.User) || user.roles.includes(RoleType.Demo))) {
      if (Util.isEmpty(user.associatedTemplates) || user.associatedTemplates.length === 0) {
        navUrl = errorPage;
        this.errorService.title = 'Initialization Error';
        this.errorService.errorMsg = 'There are no active templates available for submission.';
      } else {
        navUrl = creditAppList;
        if (localStorage.getItem('initialTemplateId') && !user.previousCreditApplication) {
          navUrl = creditAppForm + '/' + localStorage.getItem('initialTemplateId');
        } else if (user.associatedTemplates.length === 1 && !user.previousCreditApplication) {
          navUrl = creditAppForm + '/' + user.associatedTemplates[0].id;
        }
      }
    } else {
      if (user.roles.includes(RoleType.Admin)) {
        navUrl = adminUserList;
      } else if (user.roles.includes(RoleType.ClientAdmin)) {
        navUrl = creditAppAdminList;
      } else {
        navUrl = templateDesigner;
      }
    }

    return navUrl;
  }

  private disableBrowserWindowDragDropEvents() {
    // We want to disable browser window drag/drop events
    // except for explicitly-configured dropzones.
    window.addEventListener('dragenter', function(evt: any) {
      if (!Util.isEmpty(evt.target.className)) {
        if (!evt.target.className.toString().includes('k-dropzone')) {
          evt.preventDefault();
        }
      }
    });

    window.addEventListener('dragover', function(evt: any) {
      if (!Util.isEmpty(evt.target.className)) {
        if (!evt.target.className.toString().includes('k-dropzone')) {
          evt.preventDefault();
        }
      }
    });

    window.addEventListener('drop', function(evt: any) {
      if (!Util.isEmpty(evt.target.className)) {
        if (!evt.target.className.toString().includes('k-dropzone')) {
          evt.preventDefault();
        }
      }
    });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      this.theme.logo = `url(${(<string>reader.result)})`;
      this.themeService.preview(this.theme);
      localStorage.setItem('theme', JSON.stringify(this.theme));
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

   return  this.http.get(imgUrl, { 'responseType': 'blob' });
  }
}
