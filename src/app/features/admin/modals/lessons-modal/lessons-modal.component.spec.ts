import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonsModalComponent } from './lessons-modal.component';

describe('LessonsModalComponent', () => {
  let component: LessonsModalComponent;
  let fixture: ComponentFixture<LessonsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LessonsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
