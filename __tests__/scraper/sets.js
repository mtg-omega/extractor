import scrapeSets from '../../src/scraper/sets';

describe('Scrape sets', () => {
  it('should scrape sets', () => scrapeSets()
    .then((rawSets) => {
      expect(rawSets).toHaveLength(985);

      const rawSet = rawSets[0];
      expect(rawSet.name).toBeDefined();
      expect(rawSet.code).toBeDefined();
      expect(rawSet.language).toBeDefined();
    }));
});
