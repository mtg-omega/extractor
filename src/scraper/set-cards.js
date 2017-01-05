export const url = 'http://magiccards.info/{SET}/{LANGUAGE}.html';

export function scrape($) {
  const setCards = [];

  const $abbrAndLang = $('h1 small');
  const [set, language] = $abbrAndLang.text().split('/');

  const $setCards = $('table + hr + table tr + tr');

  $setCards.each((setCardIndex, setCard) => {
    const $setCard = $(setCard);

    const $index = $setCard.find('td:first-child');
    const index = parseInt($index.text(), 10);

    const $name = $index.next('td');
    const name = $name.text();

    const $type = $name.next('td');
    const typeStr = $type.text();

    const match = typeStr.match(/^([^\s～]+)( ([^—～―:]+))?((( — )|(～)|( ― )|( : ))([^\d\n]+)(([\d*]+)\/([\d*]+))?( \(Loyalty: (\d+)\))?)?$/);
    const type = match[3] || match[1];
    const supertype = match[3] ? match[1] : null;
    let subtype = match[10] || null;
    if (subtype) {
      subtype = subtype.trim();
    }

    let power = match[12];
    if (typeof power === 'undefined') {
      power = null;
    } else if (power !== '*') {
      power = parseInt(power, 10);
    }

    let toughness = match[13];
    if (typeof toughness === 'undefined') {
      toughness = null;
    } else if (toughness !== '*') {
      toughness = parseInt(toughness, 10);
    }

    const loyalty = match[15] || null;

    const $mana = $type.next('td');
    const mana = $mana.text();

    const $rarity = $mana.next('td');
    const rarity = $rarity.text();

    const $artist = $rarity.next('td');
    const artist = $artist.text();

    setCards.push({
      set,
      language,
      index,
      name,
      typeStr,
      type,
      supertype,
      subtype,
      power,
      toughness,
      loyalty,
      mana,
      rarity,
      artist,
    });
  });

  return setCards;
}
