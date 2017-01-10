import cheerio from 'cheerio';
import request from 'request-promise';

const UA = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';

export default async function (url) {
  return await request({
    url,
    headers: {
      'User-Agent': UA,
    },
    transform: body => cheerio.load(body),
  });
}
