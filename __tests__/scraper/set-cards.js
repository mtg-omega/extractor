import scrapeSetCards from '../../src/scraper/set-cards';

describe('Scrape set cards', () => {
  it('should scrape the cards of a set', () => scrapeSetCards({ code: 'kld', language: 'en' })
    .then((cards) => {
      expect(cards).toHaveLength(274);

      const card = cards[0];
      expect(card.setCode).toBeDefined();
      expect(card.language).toBeDefined();
      expect(card.index).toBeDefined();
      expect(card.name).toBeDefined();
      expect(card.typeStr).toBeDefined();
      expect(card.type).toBeDefined();
      expect(card.superType).toBeDefined();
      expect(card.subType).toBeDefined();
      expect(card.power).toBeDefined();
      expect(card.toughness).toBeDefined();
      expect(card.loyalty).toBeDefined();
      expect(card.mana).toBeDefined();
      expect(card.rarity).toBeDefined();
      expect(card.artist).toBeDefined();
    }));
});
