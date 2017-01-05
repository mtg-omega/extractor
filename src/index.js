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

export async function scrapeSets() {
  const $ = await request({
    url: setsScraper.url,
    ...options,
  });

  return setsScraper.scrape($);
}

export async function scrapeSetCards(set, language) {
  const $ = await request({
    url: setCardsScraper.url
      .replace('{SET}', set)
      .replace('{LANGUAGE}', language),
    ...options,
  });

  return setCardsScraper.scrape($);
}

export async function scrapeCardDetails(set, language, card) {
  const $ = await request({
    url: cardDetailsScraper.url
      .replace('{SET}', set)
      .replace('{LANGUAGE}', language)
      .replace('{CARD}', card),
    ...options,
  });

  return cardDetailsScraper.scrape($);
}

export async function scrape() {
  const sets = {};
  const cards = {};

  const rawSets = await scrapeSets();
  const setAbbrs = process.env.NODE_ENV === 'test' ? Object.keys(rawSets)[0] : Object.keys(rawSets);

  for (let i = 0, totSetAbbrs = setAbbrs.length; i < totSetAbbrs; i += 1) {
    const setAbbr = setAbbrs[i];

    const name = sets[setAbbr].name;
    const languages = Object.keys(name);

    for (let j = 0, totLanguages = languages.length; j < totLanguages; j += 1) {
      const language = languages[j];

      sets[setAbbr].name[language] = name[language];

      const setCards = await scrapeSetCards(setAbbr, language);

      for (let k = 0, totSetCards = setCards.length; k < totSetCards; k += 1) {
        const setCard = setCards[k];

        const cardId = `${setCard.setId}_${setCard.index}`;

        if (typeof cards[cardId] === 'undefined') {
          cards[cardId] = {
            setCode: setCard.setId,
            code: cardId,
            index: setCard.index,
            power: setCard.power,
            toughness: setCard.toughness,
            loyalty: setCard.loyalty,
            mana: setCard.mana,
            rarity: setCard.rarity,
            artist: setCard.artist,

            name: {},
            typeStr: {},
            type: {},
            superType: {},
            subType: {},
            ability: {},
            flavor: {},
          };
        }

        cards[cardId].name[setCard.language] = setCard.name;
        cards[cardId].typeStr[setCard.language] = setCard.typeStr;
        cards[cardId].type[setCard.language] = setCard.type;
        cards[cardId].superType[setCard.language] = setCard.superType;
        cards[cardId].subType[setCard.language] = setCard.subType;

        const cardDetails = await scrapeCardDetails(setAbbr, language, setCard.index);

        cards[cardId].convertedMana = cardDetails.convertedMana;
        cards[cardId].gathererId = cardDetails.gathererId;
        cards[cardId].rules = cardDetails.rules;
        cards[cardId].legalities = cardDetails.legalities;
        cards[cardId].ability[setCard.language] = cardDetails.ability;
        cards[cardId].flavor[setCard.language] = cardDetails.flavor;
      }
    }
  }
}

export function export2mongo() {}
