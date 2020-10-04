import { Component, Input, ElementRef } from '@angular/core';
import { FocusService } from '@creditpoint/spa';

import { User } from '../../shared/models/user';

@Component({
  selector: 'user-summary-item',
  templateUrl: './user-summary-item.component.html',
  styleUrls: ['./user-summary-item.component.scss']
})
export class UserSummaryItemComponent {
  @Input() user: User;
  editRoles = false;

  constructor(private el: ElementRef, private focusService: FocusService) { }

  editUserRoles() {
    this.editRoles = true;

    setTimeout(() => {
      this.focusService.showFocus = true;
    }, 750);
  }

  closeUserRolesEdit() {
    const div: HTMLElement = this.el.nativeElement.querySelector('div.edit-roles');
    div.className = 'animated fadeOutUp edit-roles';

    setTimeout(() => {
      this.focusService.showFocus = false;
      this.editRoles = false;
      div.className = 'animated fadeInDown edit-roles';
    }, 750);
  }
}
