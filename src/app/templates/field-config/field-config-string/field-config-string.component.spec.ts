import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigStringComponent } from './field-config-string.component';

describe('FieldConfigStringComponent', () => {
  let component: FieldConfigStringComponent;
  let fixture: ComponentFixture<FieldConfigStringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigStringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigStringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
