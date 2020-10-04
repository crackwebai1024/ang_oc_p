import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFieldsetsComponent } from './aside-fieldsets.component';

describe('AsideFieldsetsComponent', () => {
  let component: AsideFieldsetsComponent;
  let fixture: ComponentFixture<AsideFieldsetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideFieldsetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideFieldsetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
