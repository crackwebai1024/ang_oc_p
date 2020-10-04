/**
 * AppConfig also includes SpaAppConfig interface properties: tokenKey and appBasePath.
 */
export interface AppConfig {
  tokenKey: string;
  appBasePath: string;
  authUrl: string;
  auth0Url: string;
  apiBaseUrlTpl: string;
  apiBaseUrlPdf: string;
  apiAuthUrl: string;
  templatePath: string;
  refreshTokenPath: string;
  templateFieldsPath: string;
  dropdownListPath: string;
  creditAppPath: string;
  docuSignPath: string;
  creditsafePath: string;
  userPath: string;
  currentUserPath: string;
  filePath: string;
  fileUploadPath: string;
  fileDownloadPath: string;
  fileDeletionPath: string;
  themesPath: string;
  pdfDownloadCreditAppPath: string;
  pdfDownloadTemplatePath: string;
  endPointTpl: string;
  endPointPdf: string;
  authUserPath: string;
  changePasswordPath: string;
  clientSettingsPath: string;
}
