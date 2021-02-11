import * as nodemailer from 'nodemailer';
import Mail, { Attachment } from 'nodemailer/lib/mailer';
import Handlebars from 'handlebars';
import { app } from '../core-config/app';
import { MailQueueLogStatusEnum } from '@subtitles-translator/enums';
import { MailQueueLogService } from '../mail-queue-log/mail-queue-log.service';
import Bull from 'bull';
import { MailQueueLog } from '@subtitles-translator/entities';
// TODO: should be moved to better devops solution
import GsuitKey from 'gsuit.json';

// obtain gsuit config
const getGsuitKey = () => {
  const getAppname = app().appName;
  // console.log('getAppname=', getAppname);
  if (getAppname === 'Subtitle Translator App') {
    return GsuitKey;
  }
  return null;
};

// create transport with IMPERSONATION
// 0Auth2 in nodemail gives this option to perform server to server auth
const createGsuitTransporter = (fromEmail: string): Mail => {
  const key = getGsuitKey();
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: fromEmail,
      serviceClient: key.client_id,
      privateKey: key.private_key,
    },
  });
  return transporter;
};

// log completed email
const logEmailQueue = async (
  id: Bull.JobId,
  service: MailQueueLogService,
  partialResponse: Partial<MailQueueLog>
) => {
  const jobID = String(id);
  try {
    await service.repo.update(
      { jobId: jobID },
      {
        ...partialResponse,
        jobStatus: MailQueueLogStatusEnum.Completed,
      }
    );
    console.debug(`Query builder onComplete() saved for job = ${jobID}`);
  } catch (e) {
    console.error(`Query builder onComplete() FAILED for job = ${jobID}`);
    console.error(e);
  }
};

// Orchestration of sending eamil
const sendTemplateEmail = (
  jobId: Bull.JobId,
  service: MailQueueLogService,
  toEmail: string,
  fromEmail: string,
  subject: string,
  html: string,
  context: unknown,
  processName: string,
  attachements?: Attachment[]
): void => {
  try {
    const mailService = createGsuitTransporter(fromEmail);
    const template = Handlebars.compile(html);
    const compiledHtml = template(context);

    mailService.sendMail(
      {
        from: fromEmail,
        subject,
        to: toEmail,
        html: compiledHtml,
        attachments: attachements,
      },
      async (error, info) => {
        if (error) {
          // TODO: maybe mail address doesn't exists
          // wrong email error is: Error: invalid_grant
          console.log('Message sent failed: %s', error);
          try {
            await logEmailQueue(jobId, service, {
              emailHtml: compiledHtml,
              emailFailMessage: error.message,
              emailFailStack: error.stack,
            });
          } catch (e) {
            console.log('Error saving ERROR Log email queue');
          }
        }
        try {
          console.log('Message sent success: %s', info.messageId);
          await logEmailQueue(jobId, service, {
            emailHtml: compiledHtml,
            emailSentSucessId: info.messageId,
          });
        } catch (e) {
          console.log('Error saving SUCCESS Log email queue');
        }
      }
    );
  } catch (e) {
    console.error(
      `Error sending mail in the Queue Process of = ${processName}`
    );
    console.error(e);
  }
};

export { createGsuitTransporter, sendTemplateEmail };
