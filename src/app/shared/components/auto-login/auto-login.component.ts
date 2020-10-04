import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'auto-login',
  templateUrl: './auto-login.component.html',
  styleUrls: ['./auto-login.component.scss']
})
export class AutoLoginComponent  implements OnInit {
  returnURL:string = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router) {
      this.route.queryParams.subscribe(params => {
        this.returnURL = params['continue'];
      });
    }

    ngOnInit() {
      if(this.returnURL == undefined){
        this.returnURL = "";
      }
      this.router.navigate([this.returnURL])
    }
}
