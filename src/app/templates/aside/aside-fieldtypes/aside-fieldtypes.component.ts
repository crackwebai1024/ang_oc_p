import { Component, OnInit } from '@angular/core';

import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerItemType } from '../../shared/models/designer-item-type';
import { AsideService } from '../../shared/services/aside.service';
import { FieldTypes } from '../../shared/data/fieldtypes';

@Component({
  selector: 'cap-aside-fieldtypes',
  templateUrl: './aside-fieldtypes.component.html',
  styleUrls: ['./aside-fieldtypes.component.scss']
})
export class AsideFieldTypesComponent implements OnInit {
  items: DesignerItem[];

  constructor(private asideService: AsideService) {
  }

  ngOnInit() {
    this.asideService.getFieldTypes()
      .subscribe(items => {
          items.map(item => {
            item.isFieldType = true;
            this.items = items;
          });
      });
  }
}
