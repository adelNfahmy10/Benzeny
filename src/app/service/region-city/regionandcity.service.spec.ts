import { TestBed } from '@angular/core/testing';

import { RegionandcityService } from './regionandcity.service';

describe('RegionandcityService', () => {
  let service: RegionandcityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegionandcityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
