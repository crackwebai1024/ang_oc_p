import { TestBed, inject } from '@angular/core/testing';

import { StateResolver } from './state.resolver';

describe('StateResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateResolver]
    });
  });

  xit('should be created', inject([StateResolver], (service: StateResolver) => {
    expect(service).toBeTruthy();
  }));
});
