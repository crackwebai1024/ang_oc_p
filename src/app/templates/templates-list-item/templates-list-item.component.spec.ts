import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesListItemComponent } from './templates-list-item.component';

describe('TemplatesListItemComponent', () => {
  let component: TemplatesListItemComponent;
  let fixture: ComponentFixture<TemplatesListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplatesListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
