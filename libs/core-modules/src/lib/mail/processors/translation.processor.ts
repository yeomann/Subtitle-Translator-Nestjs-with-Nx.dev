import { sendTemplateEmail } from '../mail-options.factory';
import { Job } from 'bull';
import { MailQueueLogService } from '../../mail-queue-log/mail-queue-log.service';
import { MAIL_PROCESS } from '@subtitles-translator/constants';
import { TranslatedFile } from '@subtitles-translator/interfaces';
import { strToBuffer } from '@subtitles-translator/utils';
// html template for sending email to the user
const html = `
<h2>Dear {{userFullname}},</h2>
</br>
<h4>Thank you for using our services.</h4>
</br>
<p>Time Taken to perform translation: {{timeStamp}}</p>
<p>Original Source of Files Select was: {{sourceLang}}</p>
<p>Translated files into: {{targetLang}}</p>
<p>Hope to see you arround. Thanks</p>
</br>
</br>
<p>Regards,</p>
<p>Subtitles Translator</p>
`;
const sendTranslationsMail = (job: Job, service: MailQueueLogService): void => {
  const { data }: { data: TranslatedFile[] } = job;
  const context = data[0].context; // since all data belong to same user this we can use 1st index
  const subject = `Your Subtitles Translation is Ready - ${new Date()}`;

  // prepre nodemail attachment format
  // since from incoming job.data we added fromEmail key as well in our object.
  // so before iterative we should remove the last entery
  // we will not mutate and use sepearte instace of object
  const attachementData = Object.assign({}, data);
  delete attachementData['fromEmail'];
  const parseAttachments = [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [key, value] of Object.entries(attachementData)) {
    const singleAttachmentObj = {
      filename: value.filename,
      content: strToBuffer(value.content),
    };
    parseAttachments.push(singleAttachmentObj);
  }

  try {
    return sendTemplateEmail(
      job.id,
      service,
      context.userEmail,
      data['fromEmail'],
      subject,
      html,
      context,
      MAIL_PROCESS.SYSTEM.FINISHED_TRANSLATION,
      parseAttachments
    );
  } catch (e) {
    console.error(
      `Error sending mail in the Queue Process of = ${MAIL_PROCESS.SYSTEM.FINISHED_TRANSLATION}`
    );
    console.error(e);
  }
};

export { sendTranslationsMail };
