import cheerio from 'cheerio';
import request from 'request-promise';

import * as setsScraper from './scraper/sets';
import * as setCardsScraper from './scraper/set-cards';
import * as cardDetailsScraper from './scraper/card-details';

const options = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
  },
  transform: body => cheerio.load(body),
};

export function scrapeSets() {
  return request({
    url: setsScraper.url,
    ...options,
  })
    .then($ => setsScraper.scrape($));
}

export function scrapeSetCards(set, language) {
  return request({
    url: setCardsScraper.url
      .replace('{SET}', set)
      .replace('{LANGUAGE}', language),
    ...options,
  })
    .then($ => setCardsScraper.scrape($));
}

export function scrapeCardDetails(set, language, card) {
  return request({
    url: cardDetailsScraper.url
      .replace('{SET}', set)
      .replace('{LANGUAGE}', language)
      .replace('{CARD}', card),
    ...options,
  })
    .then($ => cardDetailsScraper.scrape($));
}

export function scrape() {
  return scrapeSets()
    .then((sets) => {
      let setAbbrs = Object.keys(sets);

      if (process.env.NODE_ENV === 'test') {
        setAbbrs = [setAbbrs[0]];
      }

      return Promise.all(setAbbrs.map((setAbbr) => {
        const name = sets[setAbbr].name;
        const languages = Object.keys(name);

        return Promise.all(languages.map(language => scrapeSetCards(setAbbr, language)
            .then(setCards => setCards
              .map(setCard => scrapeCardDetails(setAbbr, language, setCard.index)
              .then(cardDetails => ({
                set: name,
                setId: setAbbr,
                language,
                ...setCard,
                ...cardDetails,
              }))))));
      }));
    });
}

export function export2mongo() {}
