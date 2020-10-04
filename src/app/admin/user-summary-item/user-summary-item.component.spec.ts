import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryItemComponent } from './user-summary-item.component';

describe('UserSummaryItemComponent', () => {
  let component: UserSummaryItemComponent;
  let fixture: ComponentFixture<UserSummaryItemComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSummaryItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
