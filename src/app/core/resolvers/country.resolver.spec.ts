import { TestBed, inject } from '@angular/core/testing';

import { CountryResolver } from './country.resolver';

describe('CountryResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryResolver]
    });
  });

  xit('should be created', inject([CountryResolver], (service: CountryResolver) => {
    expect(service).toBeTruthy();
  }));
});
