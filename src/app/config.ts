import { SpaConfig as ISpaConfig } from '@creditpoint/spa';

import { AppConfig as IAppConfig } from './shared/models/app-config';

export const SpaConfig: ISpaConfig = {
  footerLeft: `
  <span class="animated fadeIn">
    <a href="https://creditpointsoftware.com">Online Credit App</a> &copy; 2019 CreditPoint Software.
  </span>
  `,
  footerRight: `
  <span class="animated fadeIn">
    Powered by <a href="https://creditpointsoftware.com">CPX</a>
  </span>
  `,
  headerNavs: [{
    name: 'User',
    navItems: [
      {
        url: '/list',
        name: 'My Credit Apps'
      }
    ]
  }],
  sideNavs: [{
    name: 'User',
    navItems: [
      {
        name: 'My Credit Apps',
        url: '/list'
      }
    ]
  },
  {
    name: 'ClientUser',
    navItems: [
      {
        name: 'My Credit Apps',
        url: '/list'
      }
    ]
  },
  {
    name: 'TemplateAdmin',
    navItems: [
      {
        title: true,
        name: 'Templates'
      },
      {
        name: 'Template Manager',
        url: '/templates/list',
        icon: 'fa fa-list',
      }
    ]
  },
  {
    name: 'WorkflowAdmin',
    navItems: [
      {
        title: true,
        name: 'Workflows'
      },
      {
        name: 'Workflow Designer',
        url: '/workflows/designer',
        icon: 'fa fa-sitemap'
      },
      {
        name: 'API End Points',
        url: '/workflows/api-end-points',
        icon: 'fa fa-plug'
      },
      {
        name: 'Field Mapper',
        url: '/workflows/field-mapper',
        icon: 'fa fa-exchange'
      }
    ]
  },
  {
    name: 'Admin',
    navItems: [
      {
        title: true,
        name: 'Admin'
      },
      {
        name: 'Users',
        url: '/admin/users',
        icon: 'fa fa-users'
      },
      {
        name: 'Roles',
        url: '/admin/roles',
        icon: 'fa fa-users'
      },
      {
        title: true,
        name: 'Branding'
      },
      {
        name: 'Theme Manager',
        url: '/branding/theme-manager',
        icon: 'fa fa-cog'
      }
      // {
      //   name: 'Branding',
      //   url: '/admin',
      //   icon: 'fa fa-cog',
      //   children: [
      //     {
      //       name: 'Theme Manager',
      //       url: '/admin/theme-manager',
      //       icon: 'fa fa-cog'
      //     }
      //   ]
      // }
    ]
  },
  {
    name: 'ClientAdmin',
    navItems: [
      {
        name: 'CreditApps',
        url: '/creditapps',
        icon: 'fa fa-cog'
      }
    ]
  }]
};

/**
 * AppLoader hydrates this global constant on startup.
 */
export const AppConfig: IAppConfig = {
  tokenKey: null,
  appBasePath: null,
  authUrl: null,
  auth0Url: null,
  apiBaseUrlTpl: null,
  apiBaseUrlPdf: null,
  apiAuthUrl: null,
  templatePath: null,
  refreshTokenPath: null,
  templateFieldsPath: null,
  dropdownListPath: null,
  creditAppPath: null,
  docuSignPath: null,
  creditsafePath: null,
  userPath: null,
  currentUserPath: null,
  filePath: null,
  fileUploadPath: null,
  fileDownloadPath: null,
  fileDeletionPath: null,
  themesPath: null,
  pdfDownloadCreditAppPath: null,
  pdfDownloadTemplatePath: null,
  endPointTpl: null,
  endPointPdf: null,
  authUserPath: null,
  changePasswordPath: null,
  clientSettingsPath: null
};
