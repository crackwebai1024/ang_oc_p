import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigAttachmentComponent } from './field-config-attachment.component';

describe('FieldConfigAttachmentComponent', () => {
  let component: FieldConfigAttachmentComponent;
  let fixture: ComponentFixture<FieldConfigAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
