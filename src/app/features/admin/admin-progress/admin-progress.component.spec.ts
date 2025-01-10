import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProgressComponent } from './admin-progress.component';

describe('AdminProgressComponent', () => {
  let component: AdminProgressComponent;
  let fixture: ComponentFixture<AdminProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProgressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
