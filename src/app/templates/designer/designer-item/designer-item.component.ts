import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { DynamicComponentDirective } from '../../shared/directives/dynamic-component.directive';
import { DynamicItem } from '../../shared/models/dynamic-item';
import { Item } from '../../shared/models/item';
import { DesignerFieldComponent } from '../designer-field/designer-field.component';
import { DynamicTypeService } from '../../shared/services/dynamic-type.service';
import { DesignerItemType } from '../../shared/models/designer-item-type';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';

@Component({
  selector: 'designer-item',
  templateUrl: './designer-item.component.html',
  styleUrls: ['./designer-item.component.scss']
})
export class DesignerItemComponent implements OnInit {
  @Input() item: DesignerItem;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  @ViewChild(DynamicComponentDirective) dynamicComponentHost: DynamicComponentDirective;
  dynamicItem: DynamicItem;
  componentRef: any;
  @Output() delete = new EventEmitter<DesignerItem>();

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dynamicTypeService: DynamicTypeService) { }

  ngOnInit() {
    this.dynamicItem = this.dynamicTypeService.getDesignerItem(this.item.type);

    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicItem.component);

    const viewContainerRef = this.dynamicComponentHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (<Item>this.componentRef.instance).item = this.item;
    (<Item>this.componentRef.instance).templateInstance = this.templateInstance;
    (<Item>this.componentRef.instance).dropdowns = this.dropdowns;

    // Relay dynamic child component's delete event.
    (<Item>this.componentRef.instance).delete.asObservable()
      .subscribe({
        next: (item: DesignerItem) => {
          this.delete.emit(item);
        }
      });
  }

  getChildItem(): Item {
    return <Item>this.componentRef.instance;
  }
}
