export function handleStart() {}

export function handleJob() {}

export function handler(event, context, done) {
  // Let's check who triggered the Lambda Function
  if (event.source === 'aws.events') {
    // Lambda is triggered by a scheduled event
    const resource = event.resources[0];
    const resourceName = resource.split('/')[1];

    switch (resourceName) {
      case 'every-week':
        // Lambda is triggered by the weekly event to start the scraping
        return handleStart(done);

      case 'every-minute':
        // Lambda is triggered to launch the "consumer"
        return handleJob(done);

      default:
        throw new Error(`Unknown resource: ${resource}`);
    }
  }

  throw new Error(`Unknown trigger: ${JSON.stringify(event)}`);
}
