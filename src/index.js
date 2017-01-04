import cheerio from 'cheerio';
import request from 'request-promise';

import * as setsScraper from './scraper/sets';
import * as setCardsScraper from './scraper/set-cards';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  },
  transform: body => cheerio.load(body),
};

export function scrapeSets() {
  return request({ url: setsScraper.url, ...options })
    .then($ => setsScraper.scrape($));
}

export function scrapeSetCards(set, language) {
  return request({ url: setCardsScraper.url.replace('{SET}', set).replace('{LANGUAGE}', language), ...options })
    .then($ => setCardsScraper.scrape($));
}

export function export2mongo() {}
