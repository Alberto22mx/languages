import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhrasesGamesComponent } from './phrases-games.component';

describe('PhrasesGamesComponent', () => {
  let component: PhrasesGamesComponent;
  let fixture: ComponentFixture<PhrasesGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhrasesGamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhrasesGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
