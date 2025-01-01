import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForeverComponent } from './forever.component';

describe('ForeverComponent', () => {
  let component: ForeverComponent;
  let fixture: ComponentFixture<ForeverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForeverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ForeverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
