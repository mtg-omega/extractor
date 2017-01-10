import scrapeCardDetails from '../../src/scraper/card-details';

describe('Scrape card details', () => {
  it('should scrape the details of a card', () => scrapeCardDetails({ code: 'kld', language: 'en', index: 1 })
    .then((cardDetails) => {
      expect(cardDetails.convertedMana).toBeDefined();
      expect(cardDetails.ability).toBeDefined();
      expect(cardDetails.flavor).toBeDefined();
      expect(cardDetails.gathererId).toBeDefined();
      expect(cardDetails.rules).toBeDefined();
      expect(cardDetails.legalities).toBeDefined();
    }));
});
