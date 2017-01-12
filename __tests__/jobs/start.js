import { sqs } from '../../src/aws';
import handleStart from '../../src/jobs/start';

describe('Jobs', () => {
  afterEach(() => sqs.purgeQueue());

  it('should enqueue all the set objects', () => handleStart(), 20000);
});
