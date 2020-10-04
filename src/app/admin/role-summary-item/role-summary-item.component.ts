import { Component, OnInit, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { AuthRole } from '@creditpoint/spa';
import { ToasterService } from 'angular2-toaster';

import { RoleEditComponent } from '../role-edit/role-edit.component';
import { ConstantPool } from '@angular/compiler/src/constant_pool';

@Component({
  selector: 'role-summary-item',
  templateUrl: './role-summary-item.component.html',
  styleUrls: ['./role-summary-item.component.scss']
})
export class RoleSummaryItemComponent implements OnInit {
  @Input() role: AuthRole;
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
  }

  editRole() {
    this.modalRef = this.modalService.show(RoleEditComponent, {initialState: { role: this.role }, ignoreBackdropClick: true});

    (<RoleEditComponent> this.modalRef.content).roleAdd.asObservable()
    .subscribe({
      next: (user) => {
        setTimeout(() => {
          const count = user.roles.length;
          this.toaster.pop('success', 'Role Added', `${user.userName} role has been updated `);
        }, 500);
      }
    });

      (<RoleEditComponent> this.modalRef.content).roleDelete.asObservable()
    .subscribe({
      next: (user) => {
        setTimeout(() => {
          this.toaster.pop('success', 'Role Removed', `${user.userName}  role has been updated `);
        }, 500);
      }

    });
  }
}
