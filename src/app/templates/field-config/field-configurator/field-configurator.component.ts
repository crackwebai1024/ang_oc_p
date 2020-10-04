import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';

import { DynamicComponentDirective } from '../../shared/directives/dynamic-component.directive';
import { DynamicItem } from '../../shared/models/dynamic-item';
import { FieldConfig } from '../../shared/models/field-config';
import { DynamicTypeService } from '../../shared/services/dynamic-type.service';
import { DesignerItem } from '../../shared/models/designer-item';
import { DesignerTemplate } from '../../shared/models/designer-template';
import { DesignerDropdownList } from '../../shared/models/designer-dropdownlist';
import { DesignerService } from '../../shared/services/designer.service';

@Component({
  selector: 'field-configurator',
  templateUrl: './field-configurator.component.html',
  styleUrls: ['./field-configurator.component.scss']
})
export class FieldConfiguratorComponent implements OnInit {
  @Input() item: DesignerItem;
  @Input() itemOriginal: DesignerItem;
  @Input() templateInstance: DesignerTemplate;
  @Input() dropdowns: Array<DesignerDropdownList>;
  @ViewChild(DynamicComponentDirective) dynamicComponentHost: DynamicComponentDirective;
  dynamicItem: DynamicItem;
  @Output() complete = new EventEmitter<boolean>();
  componentRef: any;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private dynamicTypeService: DynamicTypeService,
    private designerService: DesignerService) { }

  ngOnInit() {
    this.dynamicItem = this.dynamicTypeService.getFieldConfigItem(this.item.type);
    this.itemOriginal = Object.assign(this.item);
    this.loadComponent();
  }

  loadComponent() {
    this.designerService.removeField(this.item);

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.dynamicItem.component);
    const viewContainerRef = this.dynamicComponentHost.viewContainerRef;
    viewContainerRef.clear();

    this.componentRef = viewContainerRef.createComponent(componentFactory);
    (<FieldConfig>this.componentRef.instance).item = this.item;
    (<FieldConfig>this.componentRef.instance).templateInstance = this.templateInstance;
    (<FieldConfig>this.componentRef.instance).dropdowns = this.dropdowns;
  }

  isFieldConfigValid() {
    return (<FieldConfig>this.componentRef.instance).form.valid;
  }

  confirmFieldEdit() {
    this.designerService.addField(this.item);
    const fieldConfig = (<FieldConfig>this.componentRef.instance);
    fieldConfig.saveItem();
    this.complete.emit(fieldConfig.form.dirty);
  }

  cancelFieldEdit() {
    this.designerService.addField(this.itemOriginal);
    this.complete.emit(false);
  }
}
