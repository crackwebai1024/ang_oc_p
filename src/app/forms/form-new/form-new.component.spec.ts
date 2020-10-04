import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormNewComponent } from './form-new.component';

describe('FormNewComponent', () => {
  let component: FormNewComponent;
  let fixture: ComponentFixture<FormNewComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
