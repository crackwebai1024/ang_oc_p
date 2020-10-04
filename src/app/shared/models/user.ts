import { AuthUser } from '@creditpoint/spa';

import { Template } from './template';

export class User extends AuthUser {
  previousCreditApplication: boolean;
  associatedTemplates: Template[];
}
