
import { Component, OnInit, Input } from '@angular/core';
import { CreditAppService } from '../../services';
import { CreditAppSummary } from '../../../forms/shared/models/credit-app-summary';

@Component({
  selector: 'creditapp-list-item',
  templateUrl: 'creditapp-list-item.component.html',
  styleUrls: ['creditapp-list-item.component.css']
})
export class CreditAppListItemComponent implements OnInit {
  @Input() creditApp: CreditAppSummary;
  @Input() clientAdmins: any[];
  appStatuses:any[] = [
      {
          key: "Submitted",
          label: "Submitted-Pending"
      },
      {
          key: "Withdrawn",
          label: "Withdrawn"
      },
      {
          key: "Unsubmitted",
          label: "Incomplete"
      },
      {
          key: "Declined",
          label: "Declined"
      },
      {
          key: "Approved",
          label: "Approved"
      },
      {
          key: "Pending",
          label: "Awaiting Additional Information"
      },
      {
          key: "ApprovedValidationNeeded",
          label: "Approved - Validation Needed"
      },
      {
          key: "ApprovedValidated",
          label: "Approved - Validated"
      }
  ];

  constructor(private creditAppService:CreditAppService) { }

  ngOnInit(): void {
    
  }

  updateStatus(){
    this.creditAppService.updateCreditAppStatus(this.creditApp.id, this.creditApp.status).subscribe((data) => {
      console.log(data);
    })
  }

  updateAssignedAdmin(){
    this.creditAppService.updateCreditAppAssignedAdmin(this.creditApp.id, this.creditApp.assignedAdmin).subscribe((data) => {
      console.log(data);
    })
  }
}