import { scrapeRawSets, scrapeSets } from '../../src/scraper/sets';

describe('Scraper sets', () => {
  it('should scrape raw sets', () => scrapeRawSets()
    .then((rawSets) => {
      expect(rawSets).toHaveLength(985);

      const rawSet = rawSets[0];
      expect(rawSet.name).toBeDefined();
      expect(rawSet.abbr).toBeDefined();
      expect(rawSet.language).toBeDefined();
    }));

  it('should scrape sets', () => scrapeSets()
    .then((sets) => {
      const keys = Object.keys(sets);
      expect(keys).toHaveLength(213);

      const set = sets[keys[0]];
      expect(set.name).toBeDefined();

      const languages = Object.keys(set.name);
      expect(languages).toHaveLength(11);
    }));
});
