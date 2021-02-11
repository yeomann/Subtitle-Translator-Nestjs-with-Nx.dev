export const MAIL_QUEUE = 'TMS_MAIL_QUEUE';
export const TRANSLATE_QUEUE = 'TMS_TRANSLATE_QUEUE';

// process constants
export const MAIL_PROCESS = {
  TEST_QUEUE: 'test-queue',
  AGENT: {
    WELCOME: 'agent-welcome',
  },
  SYSTEM: {
    START_TRANSLATION: 'system-start-translating',
    FINISHED_TRANSLATION: 'system-end-translating',
  },
};

export const TRANSLATE_PROCESS = {
  START_TRANSLATE_QUEUE: 'start-translate-queue',
};
