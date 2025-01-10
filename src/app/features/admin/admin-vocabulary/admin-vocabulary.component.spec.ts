import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVocabularyComponent } from './admin-vocabulary.component';

describe('AdminVocabularyComponent', () => {
  let component: AdminVocabularyComponent;
  let fixture: ComponentFixture<AdminVocabularyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVocabularyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminVocabularyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
