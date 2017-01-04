import {
  scrape,
  scrapeSets,
  scrapeSetCards,
  scrapeCardDetails,
} from '../src/index';

describe('Scraper', () => {
  it('should scrape the sets', () => scrapeSets()
    .then(sets => expect(Object.keys(sets)).toHaveLength(213)));

  it('should scrape the set cards', () => scrapeSetCards('kld', 'en')
    .then((setCards) => {
      expect(Object.keys(setCards)).toHaveLength(274);

      const setCard = setCards[1];
      expect(setCard.index).toBe(2);
      expect(setCard.name).toBe('Aerial Responder');
      expect(setCard.type).toBe('Creature');
      expect(setCard.subtype).toBe('Dwarf Soldier');
      expect(setCard.power).toBe(2);
      expect(setCard.toughness).toBe(3);
      expect(setCard.mana).toBe('1WW');
      expect(setCard.rarity).toBe('Uncommon');
      expect(setCard.artist).toBe('Raoul Vitale');
    }));

  it('should scrape the card details', () => scrapeCardDetails('isd', 'en', '228')
    .then((cardDetails) => {
      expect(cardDetails.convertedMana).toBe(5);
      expect(cardDetails.flavor).toBe('Nothing could break it but the fall.');
      expect(cardDetails.gathererId).toBe(227083);
      expect(cardDetails.rules).toHaveLength(1);
      expect(cardDetails.legalities.Vintage).toBe('Legal');
    }));

  it('should scrape everything', () => scrape()
    .then(everything => console.log(everything)), 30000);
});
