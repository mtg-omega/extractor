import { scrapeSets, export2mongo } from '../src/index';

describe('Library', () => {
  it('should have the "scrape" function', () => {
    expect(scrapeSets).toBeDefined();
  });

  it('should have the "export2mongo" function', () => {
    expect(export2mongo).toBeDefined();
  });
});
