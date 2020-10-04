
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CreditAppService } from '../../services';
import { CreditAppSummary } from '../../../forms/shared/models/credit-app-summary';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'creditapp-list',
  templateUrl: 'creditapp-list.component.html',
  styleUrls: ['creditapp-list.component.css']
})
export class CreditAppListComponent implements OnInit {
 
  title = 'Credit Applications';
  creditApps: Array<CreditAppSummary> = [];
  isLoading:boolean = false;
  totalRecords = 0;
  currentPage:number = 1;
  totalPages:number = 0;
  clientAdmins:any[];
  constructor(private creditAppService:CreditAppService, private userService: UserService) { }

  ngOnInit() {
    this.getCreditApps();
    this.getClientAdmin();
  }

  getCreditApps(){
    this.isLoading = true;
    this.creditAppService.getAllCreditApps(this.currentPage)
    .subscribe({
      next: result => {
        this.creditApps = result.data.filter(app => app.status.toLowerCase() !== 'deleted');
        this.totalRecords = result.totalRecords;
        this.totalPages = result.totalPages;
        this.isLoading = false;
      },
      error: error => console.log(error)
    });
  }

  pageChanged(event) {
    this.currentPage = event;
    this.getCreditApps();
  }

  getClientAdmin(){
    this.userService.getClientAdmins().subscribe((data)=>{
      this.clientAdmins = data;
    })
  }
}
