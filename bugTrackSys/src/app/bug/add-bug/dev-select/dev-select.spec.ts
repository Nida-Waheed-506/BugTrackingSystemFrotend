import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevSelect } from './dev-select';

describe('DevSelect', () => {
  let component: DevSelect;
  let fixture: ComponentFixture<DevSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
