import { Component, OnInit } from '@angular/core';
import { AuthRole } from '@creditpoint/spa';

import { RolesService } from '../shared/services/roles.service';

@Component({
  selector: 'role-summary-list',
  templateUrl: './role-summary-list.component.html',
  styleUrls: ['./role-summary-list.component.scss']
})
export class RoleSummaryListComponent implements OnInit {
  roles: Array<AuthRole>;
  title = 'Role Maintenance';

  constructor(private rolesService: RolesService) { }

  ngOnInit() {
    this.roles = this.rolesService.getUserRoles();
  }
}
