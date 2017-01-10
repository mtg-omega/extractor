import request from '../request';

const url = 'http://magiccards.info/sitemap.html';

/**
 * Returns an array containing all the set objects
 *
 * @returns {Promise.<[{ name, code, language }]>}
 */
export default async function scrapeSets() {
  const $ = await request(url);

  const sets = [];
  const languageAbbrs = $('h2 > small');

  languageAbbrs.each((languageAbbrIndex, languageAbbrDom) => {
    const $languageAbbr = $(languageAbbrDom);
    const language = $languageAbbr.text();

    const $h2 = $languageAbbr.parent('h2');
    const $table = $h2.next('table');
    const $sets = $table.find('a');

    $sets.each((setIndex, setDom) => {
      const $set = $(setDom);

      const name = $set.text();
      const code = $set.next('small').text();

      sets.push({
        name,
        code,
        language,
      });
    });
  });

  return sets;
}
