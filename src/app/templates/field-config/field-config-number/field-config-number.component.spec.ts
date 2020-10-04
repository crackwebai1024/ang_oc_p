import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigNumberComponent } from './field-config-number.component';

describe('FieldConfigNumberComponent', () => {
  let component: FieldConfigNumberComponent;
  let fixture: ComponentFixture<FieldConfigNumberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigNumberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
