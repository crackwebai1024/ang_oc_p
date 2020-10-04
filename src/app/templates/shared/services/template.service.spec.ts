import { TestBed, inject } from '@angular/core/testing';

import { TemplateService } from './template.service';

describe('TemplateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateService]
    });
  });

  xit('should be created', inject([TemplateService], (service: TemplateService) => {
    expect(service).toBeTruthy();
  }));
});
