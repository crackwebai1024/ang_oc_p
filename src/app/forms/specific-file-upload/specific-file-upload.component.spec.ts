import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificFileUploadComponent } from './specific-file-upload.component';

describe('SpecificFileUploadComponent', () => {
  let component: SpecificFileUploadComponent;
  let fixture: ComponentFixture<SpecificFileUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificFileUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
