import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideDocumentsComponent } from './aside-documents.component';

describe('AsideDocumentsComponent', () => {
  let component: AsideDocumentsComponent;
  let fixture: ComponentFixture<AsideDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsideDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsideDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
