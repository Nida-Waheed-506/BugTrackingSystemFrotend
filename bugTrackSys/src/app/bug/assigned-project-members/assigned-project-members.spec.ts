import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedProjectMembers } from './assigned-project-members';

describe('AssignedProjectMembers', () => {
  let component: AssignedProjectMembers;
  let fixture: ComponentFixture<AssignedProjectMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignedProjectMembers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedProjectMembers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
