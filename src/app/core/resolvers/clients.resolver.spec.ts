import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { clientsResolver } from './clients.resolver';

describe('clientsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => clientsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
