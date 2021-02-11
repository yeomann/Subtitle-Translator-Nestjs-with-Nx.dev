import Bull from 'bull';

export interface AgentUploadReponse {
  message: string;
  queueInfo: {
    id: Bull.JobId;
    timestamp: number;
  };
}
