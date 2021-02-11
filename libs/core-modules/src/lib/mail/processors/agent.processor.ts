import { sendTemplateEmail } from '../mail-options.factory';
import { Job } from 'bull';
import { MailQueueLogService } from '../../mail-queue-log/mail-queue-log.service';
import { MAIL_PROCESS } from '@subtitles-translator/constants';

const sendWelcomeAgentMail = (job: Job, service: MailQueueLogService): void => {
  const { fullName, email, password, fromEmail } = job.data;
  const subject = 'New account for Subtitles Translator';
  const html = `
      <h2>Hi ${fullName},</h2>
      </br>
      <p>Welcome to Subtitles Translator.</p>
      </br>
      <p>Your initial password to the Subtitles Translation System is: <strong>${password}</strong></p>
    `;
  try {
    return sendTemplateEmail(
      job.id,
      service,
      email,
      fromEmail,
      subject,
      html,
      null,
      MAIL_PROCESS.AGENT.WELCOME
    );
  } catch (e) {
    console.error(
      `Error sending mail in the Queue Process of = ${MAIL_PROCESS.AGENT.WELCOME}`
    );
    console.error(e);
  }
};

export { sendWelcomeAgentMail };
