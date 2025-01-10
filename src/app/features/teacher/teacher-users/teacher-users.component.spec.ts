import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherUsersComponent } from './teacher-users.component';

describe('TeacherUsersComponent', () => {
  let component: TeacherUsersComponent;
  let fixture: ComponentFixture<TeacherUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
