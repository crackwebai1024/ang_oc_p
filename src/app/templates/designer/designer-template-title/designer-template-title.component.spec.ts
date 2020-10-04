import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerTemplateTitleComponent } from './designer-template-title.component';

describe('DesignerTemplateTitleComponent', () => {
  let component: DesignerTemplateTitleComponent;
  let fixture: ComponentFixture<DesignerTemplateTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerTemplateTitleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerTemplateTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
