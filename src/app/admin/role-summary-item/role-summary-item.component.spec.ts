import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSummaryItemComponent } from './role-summary-item.component';

describe('RoleSummaryItemComponent', () => {
  let component: RoleSummaryItemComponent;
  let fixture: ComponentFixture<RoleSummaryItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleSummaryItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSummaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
