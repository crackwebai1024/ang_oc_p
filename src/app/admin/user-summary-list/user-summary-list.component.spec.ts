import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryListComponent } from './user-summary-list.component';

describe('UserSummaryListComponent', () => {
  let component: UserSummaryListComponent;
  let fixture: ComponentFixture<UserSummaryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSummaryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSummaryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
