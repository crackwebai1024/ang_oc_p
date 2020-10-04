import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormListItemComponent } from './form-list-item.component';

describe('FormSummaryItemComponent', () => {
  let component: FormListItemComponent;
  let fixture: ComponentFixture<FormListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
