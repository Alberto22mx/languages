import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherGroupsComponent } from './teacher-groups.component';

describe('TeacherGroupsComponent', () => {
  let component: TeacherGroupsComponent;
  let fixture: ComponentFixture<TeacherGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
