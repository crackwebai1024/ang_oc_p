import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerFieldsetComponent } from './designer-fieldset.component';

describe('DesignerFieldsetComponent', () => {
  let component: DesignerFieldsetComponent;
  let fixture: ComponentFixture<DesignerFieldsetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerFieldsetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerFieldsetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
