import { TestBed } from '@angular/core/testing';

import { TutorGuardGuard } from './tutor-guard.guard';

describe('TutorGuardGuard', () => {
  let guard: TutorGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TutorGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
