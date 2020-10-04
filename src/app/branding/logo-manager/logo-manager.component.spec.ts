import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoManagerComponent } from './logo-manager.component';

describe('LogoManagerComponent', () => {
  let component: LogoManagerComponent;
  let fixture: ComponentFixture<LogoManagerComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
