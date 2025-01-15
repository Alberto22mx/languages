import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsModalComponent } from './groups-modal.component';

describe('GroupsModalComponent', () => {
  let component: GroupsModalComponent;
  let fixture: ComponentFixture<GroupsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupsModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
