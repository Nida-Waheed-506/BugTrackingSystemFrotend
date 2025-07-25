import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Img } from './img';

describe('Img', () => {
  let component: Img;
  let fixture: ComponentFixture<Img>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Img]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Img);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
