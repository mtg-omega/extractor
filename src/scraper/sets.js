export const url = 'http://magiccards.info/sitemap.html';

/**
 * Scrapes the list of sets from the page provided
 *
 * Returns this object: {
 *   "set1": {
 *     "name": {
 *       "language1": "",
 *       "language2": ""
 *     }
 *   },
 *   "set2": {
 *     "name": {
 *       "language1": "",
 *       "language2": ""
 *     }
 *   }
 * }
 *
 * @param $
 * @return {Object}
 */
export function scrape($) {
  const sets = {};
  const languageAbbrs = $('h2 > small');

  languageAbbrs.each((languageAbbrIndex, languageAbbrDom) => {
    const $languageAbbr = $(languageAbbrDom);
    const languageAbbr = $languageAbbr.text();

    const $h2 = $languageAbbr.parent('h2');
    const $table = $h2.next('table');
    const $sets = $table.find('a');

    $sets.each((setIndex, setDom) => {
      const $set = $(setDom);

      const setName = $set.text();
      const setAbbr = $set.next('small').text();

      sets[setAbbr] = sets[setAbbr] || { name: {} };
      sets[setAbbr].name[languageAbbr] = setName;
    });
  });

  return sets;
}
