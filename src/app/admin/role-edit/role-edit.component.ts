import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Output,
  EventEmitter,
} from "@angular/core";
import { ComboBoxComponent } from "@progress/kendo-angular-dropdowns";
import { AuthRole } from "@creditpoint/spa";

import { User } from "../../shared/models/user";
import { UserService } from "../../core/services/user.service";
import { BsModalRef } from "ngx-bootstrap";

@Component({
  selector: "app-role-edit",
  templateUrl: "./role-edit.component.html",
  styleUrls: ["./role-edit.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class RoleEditComponent implements OnInit {
  @ViewChild(ComboBoxComponent) private comboBox: ComboBoxComponent;
  role: AuthRole;
  users: Array<User>;
  usersInRole: Array<User>;
  selected: string;
  user: User;
  errorMessage: string = null;
  @Output() roleAdd = new EventEmitter<User>();
  @Output() roleDelete = new EventEmitter<User>();
  disableStatus: boolean = true;

  constructor(
    public bsModalRef: BsModalRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.usersInRole = this.users.filter((user) => {
          return user.roles.includes(this.role.value);
        });
      },
    });
  }

  addUserToRole(event) {
    if (!event.item.roles.includes(this.role.value)) {
      this.disableStatus = false;
      this.user = event.item;
    }
  }

  removeUserFromRole(user: User) {
    user.roles = user.roles.filter((role) => {
      return role !== this.role.value;
    });
    this.usersInRole = this.usersInRole.filter((userInRole) => {
      return userInRole.userName !== user.userName;
    });
    this.saveUser(user, "edit");
  }

  saveUser(user: User, mode: string) {
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.bsModalRef.hide();
        this.roleAdd.emit(user);
        this.user = null;
      },
      error: (err) => {
        this.disableStatus = true;
        this.errorMessage = "An error occurred adding user.";
      },
    });
  }

  addRoles() {
    if (this.user != null) {
      this.usersInRole.push(this.user);
      this.user.roles.push(this.role.value);
      this.saveUser(this.user, "add");
    }
  }

  done() {
    this.bsModalRef.hide();
  }
}
