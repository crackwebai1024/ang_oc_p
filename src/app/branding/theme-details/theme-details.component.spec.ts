import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeDetailsComponent } from './theme-details.component';

describe('ThemeDetailsComponent', () => {
  let component: ThemeDetailsComponent;
  let fixture: ComponentFixture<ThemeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThemeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
