import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigDropdownComponent } from './field-config-dropdown.component';

describe('FieldConfigDropdownComponent', () => {
  let component: FieldConfigDropdownComponent;
  let fixture: ComponentFixture<FieldConfigDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
