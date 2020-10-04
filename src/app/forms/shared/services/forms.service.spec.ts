import { TestBed, inject } from '@angular/core/testing';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/catch';

import { FormsService } from './forms.service';


describe('FormsService', () => {
   beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FormsService]
    });
    // service = TestBed.get(FormsService);
    const auth = {
      version: '1.0'
    };
  });

  xit('should be created', inject([FormsService], (service: FormsService) => {
    expect(service).toBeTruthy();
  }));

  xit('should get new creditapp', inject([HttpTestingController, FormsService],
    (httpTestingController: HttpTestingController, formsService: FormsService) => {
    const creditAppId: string = '';

    formsService.getCreditApp(creditAppId).subscribe(
      response => expect(response).toBeDefined(),
      fail
    );
    }));
});
