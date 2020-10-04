import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerStepComponent } from './designer-step.component';
import { SpaConfigService, ComponentProfile } from '@creditpoint/spa';

describe('DesignerComponent', () => {
  let component: DesignerStepComponent;
  let fixture: ComponentFixture<DesignerStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignerStepComponent ],
      providers: [SpaConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
