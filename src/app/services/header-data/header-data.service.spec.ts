import { TestBed } from '@angular/core/testing';

import { HeaderDataService } from './header-data.service';

describe('HeaderDataService', () => {
  let service: HeaderDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
