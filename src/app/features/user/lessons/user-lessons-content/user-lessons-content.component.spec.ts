import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLessonsContentComponent } from './user-lessons-content.component';

describe('UserLessonsContentComponent', () => {
  let component: UserLessonsContentComponent;
  let fixture: ComponentFixture<UserLessonsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLessonsContentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserLessonsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
