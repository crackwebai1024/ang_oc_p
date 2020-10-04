import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressOutlineComponent } from './progress-outline.component';

describe('ProgressOutlineComponent', () => {
  let component: ProgressOutlineComponent;
  let fixture: ComponentFixture<ProgressOutlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressOutlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressOutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
