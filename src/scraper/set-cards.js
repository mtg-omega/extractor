export const url = 'http://magiccards.info/{SET}/{LANGUAGE}.html';

export function scrape($) {
  const setCards = {};

  const $setCards = $('table + hr + table tr + tr');

  $setCards.each((setCardIndex, setCard) => {
    const $setCard = $(setCard);

    const $index = $setCard.find('td:first-child');
    const index = $index.text();

    const $name = $index.next('td');
    const name = $name.text();

    const $type = $name.next('td');
    const type = $type.text();

    const $mana = $type.next('td');
    const mana = $mana.text();

    const $rarity = $mana.next('td');
    const rarity = $rarity.text();

    const $artist = $rarity.next('td');
    const artist = $artist.text();

    setCards[index] = { name, type, mana, rarity, artist };
  });

  return setCards;
}
