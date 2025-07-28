import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectItems } from './project-items';

describe('ProjectItems', () => {
  let component: ProjectItems;
  let fixture: ComponentFixture<ProjectItems>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectItems]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectItems);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
