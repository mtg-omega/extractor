import request from '../request';

const url = 'http://magiccards.info/{CODE}/{LANGUAGE}/{INDEX}.html';

/**
 * Scrapes the "Card Details" page to retrieve some info that are not in the "Set" page:
 * - convertedMana,
 * - ability,
 * - flavor,
 * - gathererId,
 * - rules,
 * - legalities
 *
 * @param code      {String}
 * @param language  {String}
 * @param index     {Number}
 * @returns {Promise.<{
 *                     convertedMana: Number,
 *                     ability: String,
 *                     flavor: String,
 *                     gathererId: Number,
 *                     rules: [{ date, text }],
 *                     legalities: { String: String }
 *                     }>}
 */
export default async function scrapeCardDetails({ code, language, index }) {
  const $ = await request(url.replace('{CODE}', code).replace('{LANGUAGE}', language).replace('{INDEX}', index));

  const $info = $('form + hr + table + hr + table > tr:first-child > td:first-child + td');

  const $title = $info.find('> span:first-child');

  const $type = $title.next('p');
  const typeStr = $type.text()
    .replace(/[\t\n\s]+/g, ' ')
    .replace(/\s$/g, '');
  const typeMatches = typeStr.match(/(\((\d+)\))?$/);
  const convertedMana = parseInt(typeMatches[2], 10);

  const $ability = $type.next('p');
  const ability = $ability.html()
    .replace('<b>', '')
    .replace('</b>', '')
    .replace(/<br>/g, '\n');

  const $abilityEng = $ability.next('div');

  const $flavor = $abilityEng.length === 0 ? $ability.next('p') : $abilityEng.next('p');
  const flavor = $flavor.text();

  const $artist = $flavor.next('p');

  const $gatherer = $artist.next('p');
  const $gathererLink = $gatherer.find('a');
  const gathererHref = $gathererLink.attr('href');
  const gathererId = parseInt(gathererHref.split('multiverseid=')[1].split('&')[0], 10);

  const rules = [];
  const $rulings = $gatherer.next('ul');
  const $rules = $rulings.find('li');
  $rules.each((ruleIndex, ruleDom) => {
    const $rule = $(ruleDom);

    const $date = $rule.find('b');
    const date = $date.text();
    const text = $rule.text().replace(`${date}: `, '');

    rules.push({ date, text });
  });

  const legalities = {};
  const $legality = $rulings.next('ul');
  const $legalities = $legality.find('li');
  $legalities.each((legalityIndex, legalityDom) => {
    const $legalityDom = $(legalityDom);
    const legalityStr = $legalityDom.text();

    const legalityMatches = legalityStr.match(/^(\w+) in (\w+)/);
    const legal = legalityMatches[1];
    const format = legalityMatches[2];

    legalities[format] = legal;
  });

  return {
    convertedMana,
    ability,
    flavor,
    gathererId,
    rules,
    legalities,
  };
}
