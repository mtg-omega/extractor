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

  const setList = await scrapeSets();
  const setAbbrs = Object.keys(setList);
  if (process.env.NODE_ENV === 'test') {
    setAbbrs.splice(1);
  }

  for (let i = 0, totSetAbbrs = setAbbrs.length; i < totSetAbbrs; i += 1) {
    const setAbbr = setAbbrs[i];
    const setNames = setList[setAbbr].name;
    const setLanguages = Object.keys(setNames);

    sets[setAbbr] = { code: setAbbr, name: {} };

    for (let j = 0, totSetLanguages = setLanguages.length; j < totSetLanguages; j += 1) {
      const language = setLanguages[j];
      const setName = setNames[language];
      const setCards = await scrapeSetCards(setAbbr, language);

      sets[setAbbr].name[language] = setName;

      for (let k = 0, totSetCards = setCards.length; k < totSetCards; k += 1) {
        const setCard = setCards[k];
        const cardId = `${setAbbr}_${setCard.index}`;

        let cardDetails = {};

        if (typeof cards[cardId] === 'undefined') {
          cardDetails = await scrapeCardDetails(setAbbr, language, setCard.index);

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
            convertedMana: cardDetails.convertedMana,
            gathererId: cardDetails.gathererId,
            rules: cardDetails.rules,
            legalities: cardDetails.legalities,

            name: {},
            typeStr: {},
            type: {},
            superType: {},
            subType: {},
            ability: {},
            flavor: {},
          };
        }

        cards[cardId].name[language] = setCard.name;
        cards[cardId].typeStr[language] = setCard.typeStr;
        cards[cardId].type[language] = setCard.type;
        cards[cardId].superType[language] = setCard.superType;
        cards[cardId].subType[language] = setCard.subType;
        cards[cardId].ability[language] = cardDetails.ability;
        cards[cardId].flavor[language] = cardDetails.flavor;
      }
    }
  }

  return {
    sets: Object.keys(sets).map(key => sets[key]),
    cards: Object.keys(cards).map(key => cards[key]),
  };
}

export function export2mongo() {}
