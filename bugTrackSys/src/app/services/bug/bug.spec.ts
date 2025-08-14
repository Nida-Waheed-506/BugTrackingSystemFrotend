import { TestBed } from '@angular/core/testing';

import { BugService } from './bug';

describe('Bug', () => {
  let service: BugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
