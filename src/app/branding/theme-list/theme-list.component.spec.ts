import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeListComponent } from './theme-list.component';

describe('ThemeListComponent', () => {
  let component: ThemeListComponent;
  let fixture: ComponentFixture<ThemeListComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
