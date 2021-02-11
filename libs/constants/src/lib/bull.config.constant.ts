import Bull from 'bull';

export const bullJobOptions: Bull.JobOptions = {
  delay: 500,
  attempts: 5,
  backoff: {
    type: 'exponential',
    delay: 1000,
  },
  // removeOnComplete: true
  // removeOnFail: true
};
