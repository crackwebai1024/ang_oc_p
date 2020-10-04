import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAppReportComponent } from './credit-app-report.component';

describe('CreditAppReportComponent', () => {
  let component: CreditAppReportComponent;
  let fixture: ComponentFixture<CreditAppReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditAppReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditAppReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
