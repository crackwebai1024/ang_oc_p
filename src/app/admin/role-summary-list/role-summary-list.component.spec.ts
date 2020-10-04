import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleSummaryListComponent } from './role-summary-list.component';

describe('RoleSummaryListComponent', () => {
  let component: RoleSummaryListComponent;
  let fixture: ComponentFixture<RoleSummaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleSummaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
