import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VirtualTutorComponent } from './virtual-tutor.component';

describe('VirtualTutorComponent', () => {
  let component: VirtualTutorComponent;
  let fixture: ComponentFixture<VirtualTutorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VirtualTutorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VirtualTutorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
