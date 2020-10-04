import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideHostComponent } from './aside-host.component';

describe('AsideHostComponent', () => {
  let component: AsideHostComponent;
  let fixture: ComponentFixture<AsideHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideHostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // xit('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
