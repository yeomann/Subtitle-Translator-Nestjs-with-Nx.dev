import { Job } from 'bull';

const processTestQueue = (job: Job): void => {
  console.log('About to process "test-queue" job');
  console.log('job.data', job.data);
};

export { processTestQueue };
