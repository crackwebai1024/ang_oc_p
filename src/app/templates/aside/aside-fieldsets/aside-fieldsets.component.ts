import { Component, OnInit, Input } from '@angular/core';

import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'cap-aside-fieldsets',
  templateUrl: './aside-fieldsets.component.html',
  styleUrls: ['./aside-fieldsets.component.scss']
})
export class AsideFieldsetsComponent implements OnInit {
  @Input() items: DesignerItem[];

  constructor() {
  }

  ngOnInit() { }
}
