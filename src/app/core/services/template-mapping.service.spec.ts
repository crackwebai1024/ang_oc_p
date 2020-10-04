import { TestBed, inject } from '@angular/core/testing';

import { TemplateMappingService } from './template-mapping.service';

describe('TemplateMappingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateMappingService]
    });
  });

  xit('should be created', inject([TemplateMappingService], (service: TemplateMappingService) => {
    expect(service).toBeTruthy();
  }));
});
