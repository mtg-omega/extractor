import {
  scrapeSets,
  scrapeSetCards,
} from '../src/index';

describe('Scraper', () => {
  it('should scrape the sets', () => scrapeSets()
    .then(sets => expect(Object.keys(sets)).toHaveLength(213)));

  it('should scrape the set cards', () => scrapeSetCards('kld', 'en')
    .then(setCards => expect(Object.keys(setCards)).toHaveLength(274)));
});
