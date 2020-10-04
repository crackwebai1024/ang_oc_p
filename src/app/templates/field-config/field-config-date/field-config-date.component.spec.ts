import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigDateComponent } from './field-config-date.component';

describe('FieldConfigDateComponent', () => {
  let component: FieldConfigDateComponent;
  let fixture: ComponentFixture<FieldConfigDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
