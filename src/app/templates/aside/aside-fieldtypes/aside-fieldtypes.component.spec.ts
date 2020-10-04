import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFieldTypesComponent } from './aside-fieldtypes.component';

describe('AsideFieldTypesComponent', () => {
  let component: AsideFieldTypesComponent;
  let fixture: ComponentFixture<AsideFieldTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideFieldTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideFieldTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
