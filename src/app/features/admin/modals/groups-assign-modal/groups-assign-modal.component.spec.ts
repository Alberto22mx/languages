import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsAssignModalComponent } from './groups-assign-modal.component';

describe('GroupsAssignModalComponent', () => {
  let component: GroupsAssignModalComponent;
  let fixture: ComponentFixture<GroupsAssignModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsAssignModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupsAssignModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
