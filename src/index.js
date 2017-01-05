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

function wait(milliseconds = 0) {
  const milliseconds2wait = Math.round(Math.random() * milliseconds);

  return new Promise((resolve) => {
    setTimeout(() => resolve(), milliseconds2wait);
  });
}

export function scrapeSets(milliseconds2wait) {
  return wait(milliseconds2wait)
    .then(() => request({
      url: setsScraper.url,
      ...options,
    })
    .then($ => setsScraper.scrape($)));
}

export function scrapeSetCards(set, language, milliseconds2wait) {
  return wait(milliseconds2wait)
    .then(() => request({
      url: setCardsScraper.url
        .replace('{SET}', set)
        .replace('{LANGUAGE}', language),
      ...options,
    }))
    .then($ => setCardsScraper.scrape($));
}

export function scrapeCardDetails(set, language, card, milliseconds2wait) {
  return wait(milliseconds2wait)
    .then(() => request({
      url: cardDetailsScraper.url
        .replace('{SET}', set)
        .replace('{LANGUAGE}', language)
        .replace('{CARD}', card),
      ...options,
    }))
    .then($ => cardDetailsScraper.scrape($));
}

export function scrape(milliseconds2wait) {
  return scrapeSets(milliseconds2wait)
    .then((sets) => {
      let setAbbrs = Object.keys(sets);

      if (process.env.NODE_ENV === 'test') {
        setAbbrs = [setAbbrs[0]];
      }

      return Promise.all(setAbbrs.map((setAbbr) => {
        const name = sets[setAbbr].name;
        const languages = Object.keys(name);

        return Promise.all(languages
          .map(language => scrapeSetCards(setAbbr, language, milliseconds2wait)
            .then(setCards => Promise.all(setCards
              .map(setCard => scrapeCardDetails(setAbbr, language, setCard.index, milliseconds2wait)
              .then(cardDetails => ({
                set: name,
                ...setCard,
                ...cardDetails,
              })))))));
      }));
    })
    .then((rawSets) => {
      const sets = {};
      const cards = {};

      rawSets.forEach((rawLanguages) => {
        rawLanguages.forEach((rawCards) => {
          rawCards.forEach((rawCard) => {
            if (typeof sets[rawCard.setId] === 'undefined') {
              sets[rawCard.setId] = {
                code: rawCard.setId,
                name: rawCard.set,
              };
            }

            const cardId = `${rawCard.setId}_${rawCard.index}`;

            if (typeof cards[cardId] === 'undefined') {
              cards[cardId] = {
                setCode: rawCard.setId,
                code: cardId,
                index: rawCard.index,
                power: rawCard.power,
                toughness: rawCard.toughness,
                loyalty: rawCard.loyalty,
                mana: rawCard.mana,
                rarity: rawCard.rarity,
                artist: rawCard.artist,
                convertedMana: rawCard.convertedMana,
                gathererId: rawCard.gathererId,
                rules: rawCard.rules,
                legalities: rawCard.legalities,

                name: {},
                typeStr: {},
                type: {},
                superType: {},
                subType: {},
                ability: {},
                flavor: {},
              };
            }

            cards[cardId].name[rawCard.language] = rawCard.name;
            cards[cardId].typeStr[rawCard.language] = rawCard.typeStr;
            cards[cardId].type[rawCard.language] = rawCard.type;
            cards[cardId].superType[rawCard.language] = rawCard.superType;
            cards[cardId].subType[rawCard.language] = rawCard.subType;
            cards[cardId].ability[rawCard.language] = rawCard.ability;
            cards[cardId].flavor[rawCard.language] = rawCard.flavor;
          });
        });
      });

      return {
        sets: Object.keys(sets).map(key => sets[key]),
        cards: Object.keys(cards).map(key => cards[key]),
      };
    });
}

export function export2mongo() {}
