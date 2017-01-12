import { sqs } from '../aws';
import scrapeSets from '../scraper/sets';

export default async function handleStart(done) {
  const sets = await scrapeSets();

  await Promise.all(sets.map(set => sqs
    .sendMessage({
      MessageBody: JSON.stringify(set),
    })
    .promise()));

  if (done) {
    done();
  }
}
