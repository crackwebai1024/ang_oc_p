import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignerSectionTitleComponent } from './designer-section-title.component';
import { FormsModule } from '@angular/forms';
import { DesignerService } from '../../shared/services/designer.service';

describe('DesignerSectionTitleComponent', () => {
  let component: DesignerSectionTitleComponent;
  let fixture: ComponentFixture<DesignerSectionTitleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ DesignerSectionTitleComponent ],
      providers: [ DesignerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignerSectionTitleComponent);
    fixture.componentInstance = jasmine.createSpyObj([]);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
