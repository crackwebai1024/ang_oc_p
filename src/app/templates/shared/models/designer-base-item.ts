import * as shortid from 'shortid';

import { ItemTitle } from './item-title';

export class DesignerBaseItem implements ItemTitle {
  public id: string;
  public name: string;
  public displayName: string;
  public order: number;

  constructor() {
    // Unique id used to track instance after creation.
    this.id = shortid.generate();
  }
}
