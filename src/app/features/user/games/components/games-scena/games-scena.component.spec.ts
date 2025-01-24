import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesScenaComponent } from './games-scena.component';

describe('GamesScenaComponent', () => {
  let component: GamesScenaComponent;
  let fixture: ComponentFixture<GamesScenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesScenaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GamesScenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
