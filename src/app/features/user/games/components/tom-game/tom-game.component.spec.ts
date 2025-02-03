import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TomGameComponent } from './tom-game.component';

describe('TomGameComponent', () => {
  let component: TomGameComponent;
  let fixture: ComponentFixture<TomGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TomGameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TomGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
