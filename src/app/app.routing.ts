import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent, AuthGuard, CanDeactivateGuard, SpaFullLayoutComponent, SpaSimpleLayoutComponent } from '@creditpoint/spa';

import { CountryResolver } from './core/resolvers/country.resolver';
import { StateResolver } from './core/resolvers/state.resolver';
import { PasswordResetComponent } from './shared/components/password-reset/password-reset.component';
import { RoleGuardService as RoleGuard } from './core/services/role-guard.service';
import { AutoLoginComponent } from './shared/components/auto-login/auto-login.component';
import { ClientAdminRoleGuardService as ClientAdminRoleGuard} from './core/services/clientadmin-role-guard.service';

export const routes: Routes = [
  /* forms module */
  {
    path: '',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard],
    data: {
      hideSidebar: true,
      hideSidebarToggler: true,
      hideAside: true,
      hideAsideToggler: true
    },
    children: [
      {
        path: 'password-reset',
        component: PasswordResetComponent
      },
      {
        path: '',
        // canActivateChild: [AuthGuard],
        loadChildren: './forms/forms.module#FormsModule'
      }
    ]
  },
  /* admin module */
  {
    path: 'admin',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      hideSidebar: false,
      hideSidebarToggler: false,
      hideAside: true,
      hideAsideToggler: true
    },
    children: [
      {
        path: '',
        loadChildren: './admin/admin.module#AdminModule'
      }
    ]
  },
  /* branding module */
  {
    path: 'branding',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      hideSidebar: false,
      hideSidebarToggler: false,
      hideAside: true,
      hideAsideToggler: true
    },
    children: [
      {
        path: '',
        loadChildren: './branding/branding.module#BrandingModule'
      }
    ]
  },
  /* creditsafe module */
  {
    path: 'cs',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard],
    resolve: {
      countries: CountryResolver,
      states: StateResolver
    },
    data: {
      hideSidebar: true,
      hideSidebarToggler: true,
      hideAside: true,
      hideAsideToggler: true
    },
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        loadChildren: './creditsafe/creditsafe.module#CreditsafeModule'
      }
    ]
  },
  /* external-reports module */
  {
    path: 'external-reports',
    component: SpaSimpleLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        loadChildren: './external-reports/external-reports.module#ExternalReportsModule'
      }
    ]
  },
  /* templates module */
  {
    path: 'templates',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: {
      hideSidebar: false,
      hideSidebarToggler: false,
      hideAside: false,
      hideAsideToggler: true
    },
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
        loadChildren: './templates/templates.module#TemplatesModule'
      }
    ]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'auth0',
    component: AutoLoginComponent
  },
  {
    path: 'creditapps',
    component: SpaFullLayoutComponent,
    canActivate: [AuthGuard, ClientAdminRoleGuard],
    data: {
      hideSidebar: false,
      hideSidebarToggler: false,
      hideAside: true,
      hideAsideToggler: true
    },
    children: [
      {
        path: '',
        loadChildren: './creditapp/creditapp.module#CreditAppModule'
      },
      {
        path: '',
        loadChildren: './forms/forms.module#FormsModule'
      }
    ]
  },
  {
    path: '**',
    pathMatch: 'full',
    component: ErrorComponent,
    data: {
      errorCode: '404',
      title: 'Page Not Found',
      errorMsg: 'The page you are looking for does not exist.'
    }
  },
  
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false,
        onSameUrlNavigation: 'reload'
      }
    )
  ],
  exports: [ RouterModule ],
  providers: [ RoleGuard, ClientAdminRoleGuard ]
})
export class AppRoutingModule {}
