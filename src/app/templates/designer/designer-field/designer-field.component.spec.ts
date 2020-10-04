import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerFieldComponent } from './designer-field.component';

describe('DesignerFieldComponent', () => {
  let component: DesignerFieldComponent;
  let fixture: ComponentFixture<DesignerFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
