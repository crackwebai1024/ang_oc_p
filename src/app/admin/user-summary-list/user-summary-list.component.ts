import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToasterService } from 'angular2-toaster';

import { UserService } from '../../core/services/user.service';
import { User } from '../../shared/models/user';
import { RoleType } from '../../shared/models/role-type';
import { UserAddComponent, AddMode } from '../user-add/user-add.component';

@Component({
  selector: 'user-summary-list',
  templateUrl: './user-summary-list.component.html',
  styleUrls: ['./user-summary-list.component.scss']
})
export class UserSummaryListComponent implements OnInit {
  users: Array<User>;
  title = 'User Maintenance';
  modalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private toaster: ToasterService,
    private userService: UserService) {

  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers()
      .subscribe({
        next: (users) => {
          this.users = users.filter((user) => !user.roles.includes(RoleType.User));
        }
      });
  }

  addNewUser(e: Event) {
    e.preventDefault();

    this.showAddUserModal(AddMode.New);
  }

  addCpsUser(e: Event) {
    e.preventDefault();

    this.showAddUserModal(AddMode.Cps);
  }

  showAddUserModal(addMode: AddMode) {
    const config = {
      addMode: addMode
    };
    this.modalRef = this.modalService.show(UserAddComponent, {initialState: config, ignoreBackdropClick: true});

    (<UserAddComponent>this.modalRef.content).userAdd.asObservable()
      .subscribe({
        next: (user) => {
          // Refresh user list.
          this.loadUsers();

          // Give modal time to close
          setTimeout(() => {
            this.toaster.pop('success', 'User Added', `${user.firstName} ${user.lastName} has been added.`);
          }, 500);
        }
      });
  }
}
