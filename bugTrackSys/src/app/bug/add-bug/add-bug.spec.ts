import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBug } from './add-bug';

describe('AddBug', () => {
  let component: AddBug;
  let fixture: ComponentFixture<AddBug>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBug]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBug);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
