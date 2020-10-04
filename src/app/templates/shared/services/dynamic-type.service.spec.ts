import { TestBed, inject } from '@angular/core/testing';

import { DynamicTypeService } from './dynamic-type.service';

describe('DynamicTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicTypeService]
    });
  });

  xit('should be created', inject([DynamicTypeService], (service: DynamicTypeService) => {
    expect(service).toBeTruthy();
  }));
});
