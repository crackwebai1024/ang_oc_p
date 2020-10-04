import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigCheckboxComponent } from './field-config-checkbox.component';

describe('FieldConfigCheckboxComponent', () => {
  let component: FieldConfigCheckboxComponent;
  let fixture: ComponentFixture<FieldConfigCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
