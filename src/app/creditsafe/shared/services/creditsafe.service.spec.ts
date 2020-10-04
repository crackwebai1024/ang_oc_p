import { TestBed, inject } from '@angular/core/testing';

import { CreditsafeService } from './creditsafe.service';

describe('CreditsafeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditsafeService]
    });
  });

  xit('should be created', inject([CreditsafeService], (service: CreditsafeService) => {
    expect(service).toBeTruthy();
  }));
});
