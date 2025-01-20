import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherGamesComponent } from './teacher-games.component';

describe('TeacherGamesComponent', () => {
  let component: TeacherGamesComponent;
  let fixture: ComponentFixture<TeacherGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
