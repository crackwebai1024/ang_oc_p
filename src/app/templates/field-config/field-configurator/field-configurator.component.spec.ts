import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfiguratorComponent } from './field-configurator.component';

describe('FieldConfiguratorComponent', () => {
  let component: FieldConfiguratorComponent;
  let fixture: ComponentFixture<FieldConfiguratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfiguratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfiguratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
