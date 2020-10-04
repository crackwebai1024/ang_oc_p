import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigStatictextComponent } from './field-config-statictext.component';

describe('FieldConfigStatictextComponent', () => {
  let component: FieldConfigStatictextComponent;
  let fixture: ComponentFixture<FieldConfigStatictextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldConfigStatictextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldConfigStatictextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
