import { TestBed, inject } from '@angular/core/testing';

import { ExternalReportsService } from './external-reports.service';

describe('ExternalReportsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExternalReportsService]
    });
  });

  xit('should be created', inject([ExternalReportsService], (service: ExternalReportsService) => {
    expect(service).toBeTruthy();
  }));
});
