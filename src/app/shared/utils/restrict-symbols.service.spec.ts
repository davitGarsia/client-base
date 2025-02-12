import { TestBed } from '@angular/core/testing';

import { RestrictSymbolsService } from './restrict-symbols.service';

describe('RestrictSymbolsService', () => {
  let service: RestrictSymbolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RestrictSymbolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
