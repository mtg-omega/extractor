import config from 'config';
import { purgeQueue } from 'hotvenue-utils/utils/cloud';

import handleStart from '../../src/jobs/start';

describe('Jobs', () => {
  afterEach(() => purgeQueue(config.get('aws.sqs.queue')));

  it('should enqueue all the set objects', () => handleStart(), 20000);
});
