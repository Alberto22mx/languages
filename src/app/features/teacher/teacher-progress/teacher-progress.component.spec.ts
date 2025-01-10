import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherProgressComponent } from './teacher-progress.component';

describe('TeacherProgressComponent', () => {
  let component: TeacherProgressComponent;
  let fixture: ComponentFixture<TeacherProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
