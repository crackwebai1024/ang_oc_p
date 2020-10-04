import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { FieldWrapper } from '@ngx-formly/core';
import { RouterModule, Router } from '@angular/router';

@Component({
selector: 'formly-wrapper-creditsafe',
template: `
 <div class='position-relative'>
     <ng-container #fieldComponent></ng-container>
     <button (click)='buttonClickEvent($event)' class='btn btn-secondary credit-safe-search'>
     <i tooltip="Business Search" class="fa fa-search"></i>
     </button>
 </div>
`,
styles: [`
    .credit-safe-search {
        position:absolute;
        top:0px;
        right:0px;
    }
`]
})
export class ButtonWrapperComponent extends FieldWrapper {
    @ViewChild('fieldComponent', {read: ViewContainerRef}) fieldComponent: ViewContainerRef;

    constructor(private router: Router) {
        super();
    }

    buttonClickEvent(event) {
        event.preventDefault();
        this.router.navigate(['cs/business-search']);
    }
}
