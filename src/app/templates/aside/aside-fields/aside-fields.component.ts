import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';

@Component({
  selector: 'cap-aside-fields',
  templateUrl: './aside-fields.component.html',
  styleUrls: ['./aside-fields.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AsideFieldsComponent implements OnInit {
  @Input() systemFields: DesignerItem[];
  @Input() globalFields: DesignerItem[];

  constructor() {
  }

  ngOnInit() {
  }
}
