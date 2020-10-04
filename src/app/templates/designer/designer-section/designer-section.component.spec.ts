import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerSectionComponent } from './designer-section.component';

describe('DesignerSectionComponent', () => {
  let component: DesignerSectionComponent;
  let fixture: ComponentFixture<DesignerSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
