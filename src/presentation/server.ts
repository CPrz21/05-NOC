import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { FileSystemDatasource } from '../infrastructure/datasources/file-system.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImpl(
  new FileSystemDatasource()
);
const emailService = new EmailService();

export class Server {
  public static start() {
    console.log('Server started');
    new SendEmailLogs(emailService, fileSystemLogRepository).execute([
      'faselona@gmail.com',
      'cperez@cubopago.com',
    ]);
    // const emailsService = new EmailService(fileSystemLogRepository);
    // emailsService.sendEmailWithFileSystemLogs([
    //   'faselona@gmail.com',
    //   'cperez@cubopago.com',
    // ]);

    // CronService.createJob('*/5 * * * * *', () => {
    //   const url = 'https://www.google.com';
    //   // const url = 'http://localhost:3000';
    //   new CheckService(
    //     fileSystemLogRepository,
    //     () => console.log('Success'),
    //     error => console.error(error)
    //   ).execute(url);
    // });
  }
}
