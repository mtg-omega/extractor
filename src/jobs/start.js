import config from 'config';
import { sendMessage } from 'hotvenue-utils/utils/cloud';

import scrapeSets from '../scraper/sets';

export default async function handleStart(done) {
  const sets = await scrapeSets();

  await Promise.all(sets.map(set => sendMessage(config.get('aws.sqs.queue'), JSON.stringify(set))));

  if (done) {
    done();
  }
}
