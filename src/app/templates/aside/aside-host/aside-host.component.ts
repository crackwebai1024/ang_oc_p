import { Component, OnInit } from '@angular/core';
import * as shortid from 'shortid';
import { AsideService } from '../../shared/services/aside.service';
import { Observable } from 'rxjs';
import { DesignerItem } from '../../shared/models/designer-item';
import { SampleFields } from '../../shared/data/fields';
import { SampleFieldsets } from '../../shared/data/fieldsets';

import { Util } from '@creditpoint/util';
import { DesignerItemType } from '../../shared/models/designer-item-type';



@Component({
  selector: 'cap-aside-host',
  templateUrl: './aside-host.component.html',
  styleUrls: ['./aside-host.component.scss']
})
export class AsideHostComponent implements OnInit  {
  systemFields: DesignerItem[] = [];
  globalFields: DesignerItem[] = [];
  fieldGroupItems: any = [];
  fields: any;
  fieldSets: any;

  constructor(private asideService: AsideService) { }

  ngOnInit() {
    this.asideService.getGlobalFields()
      .subscribe({
        next: (items) => {
          // Filter for fields
          const fieldItems = (items).filter(item => {
            // Filter out required mapped fields from aside fields panel
            const mapFields = ['companyBusinessName', 'requestedAmount', 'companyCountry'];
            mapFields.forEach(function(value) {
              if (item.name === value) {
                item.isRequired = true;
              }
            });
            return  ((!item.isRequired
              && item.type !== DesignerItemType.FieldGroup
              && item.type !== DesignerItemType.MultipleFieldGroup
              && item.type !== DesignerItemType.ColumnGroup));
          });

          // Now let's split fields into system and global.
          this.systemFields = fieldItems.filter((item) => item.isSystemField);
          this.globalFields = fieldItems.filter((item) => !item.isSystemField);

          // Filter for fieldsets
          this.fieldSets = (items).filter(item =>
            (item.type === DesignerItemType.FieldGroup
            || item.type === DesignerItemType.MultipleFieldGroup
            || item.type === DesignerItemType.ColumnGroup));

          // Map TemplateFields fields collection to items to match with DesignerItem
          this.fieldGroupItems = Object.assign(this.fieldGroupItems, this.fieldSets);
          this.fieldGroupItems.map(r => r.items = r.fields);
        }
      });
    }

  }
