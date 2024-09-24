import nodemailer from 'nodemailer';

import { envs } from '../../config/plugins/envs.plugin';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';

interface Attachment {
  filename: string;
  path: string;
}

interface SendEmailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: Attachment[];
}

export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_SECRET_KEY,
    },
  });

  async sendEmail({
    to,
    subject,
    htmlBody,
    attachments = [],
  }: SendEmailOptions): Promise<Boolean> {
    try {
      const sentInformation = await this.transporter.sendMail({
        to,
        subject,
        html: htmlBody,
        attachments,
      });
      console.log(
        '🚀 ~ EmailService ~ sendEmail ~ sentInformation:',
        sentInformation
      );

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `Email sent to ${to}`,
        origin: 'email.service.ts',
      });

      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: `Email not sent to ${to}`,
        origin: 'email.service.ts',
      });

      return false;
    }
  }

  async sendEmailWithFileSystemLogs(
    to: SendEmailOptions['to']
  ): Promise<Boolean> {
    const subject = 'Reporte de Logs';
    const htmlBody =
      '<h1>Aqui estan los logs</h1> <p>ver archivos adjuntos</p>';

    const attachments: Attachment[] = [
      {
        filename: 'logs-all.log',
        path: './logs/logs-all.log',
      },
      {
        filename: 'logs-medium.log',
        path: './logs/logs-medium.log',
      },
      {
        filename: 'logs-high.log',
        path: './logs/logs-high.log',
      },
    ];

    const sent = await this.sendEmail({
      to,
      subject,
      htmlBody,
      attachments,
    });

    return sent;
  }
}
