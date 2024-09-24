import { EmailService } from '../../../presentation/email/email.service';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface SendLogEmailUseCase {
  execute(to: string | string[]): Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    try {
      const sent = await this.emailService.sendEmailWithFileSystemLogs(to);
      if (!sent) {
        const log = new LogEntity({
          level: LogSeverityLevel.high,
          message: 'Email not sent',
          origin: 'send-email-logs.ts',
        });
        this.logRepository.saveLog(log);

        throw new Error('Error sending email');
      }

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: 'Log Email sent',
        origin: 'send-email-logs.ts',
      });
      this.logRepository.saveLog(log);
      return true;
    } catch (error) {
      const log = new LogEntity({
        level: LogSeverityLevel.high,
        message: 'Error sending email',
        origin: 'send-email-logs.ts',
      });
      this.logRepository.saveLog(log);
      console.error(error);
      return false;
    }
  }
}
