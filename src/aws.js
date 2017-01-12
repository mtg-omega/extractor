import aws from 'aws-sdk';
import config from 'config';

// eslint-disable-next-line import/prefer-default-export
export const sqs = new aws.SQS({
  accessKeyId: config.get('aws.iam.key'),
  secretAccessKey: config.get('aws.iam.secret'),
  region: config.get('aws.region'),
  params: {
    QueueUrl: `https://sqs.${config.get('aws.region')}.amazonaws.com/${config.get('aws.accountId')}/${config.get('aws.sqs.queue')}`,
  },
});
