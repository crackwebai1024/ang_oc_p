import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigFieldGroupComponent } from './field-config-field-group.component';

describe('FieldConfigFieldGroupComponent', () => {
  let component: FieldConfigFieldGroupComponent;
  let fixture: ComponentFixture<FieldConfigFieldGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigFieldGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigFieldGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
