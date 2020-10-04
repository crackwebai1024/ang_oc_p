import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamicComponentHost]',
})
export class DynamicComponentDirective {
  constructor(public viewContainerRef: ViewContainerRef = null) { }
}
