import { TestBed, inject } from '@angular/core/testing';

import { TemplateResolver } from './template.resolver';

describe('TemplateResolver', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TemplateResolver]
    });
  });

  xit('should be created', inject([TemplateResolver], (service: TemplateResolver) => {
    expect(service).toBeTruthy();
  }));
});
