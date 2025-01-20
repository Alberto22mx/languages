import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherVocabularyComponent } from './teacher-vocabulary.component';

describe('TeacherVocabularyComponent', () => {
  let component: TeacherVocabularyComponent;
  let fixture: ComponentFixture<TeacherVocabularyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherVocabularyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
