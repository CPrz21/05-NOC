import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';

interface CheckServiceUseCase {
  execute(url: string): Promise<Boolean>;
}

const fileOrigin = 'check-service.ts';

type SuccessCallback = () => void;

type ErrorCallback = (error: string) => void;

export class CheckService implements CheckServiceUseCase {
  constructor(
    private readonly logRepository: LogRepository,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}

  public async execute(url: string): Promise<Boolean> {
    try {
      const req = await fetch(url);

      if (!req.ok) {
        throw new Error('Error on check service ' + url);
      }

      const log = new LogEntity({
        level: LogSeverityLevel.low,
        message: `${url} is up`,
        createdAt: new Date(),
        origin: fileOrigin,
      });

      this.logRepository.saveLog(log);

      this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} is not ok. ${error}`;

      this.logRepository.saveLog(
        new LogEntity({
          level: LogSeverityLevel.high,
          message: errorMessage,
          createdAt: new Date(),
          origin: fileOrigin,
        })
      );

      this.errorCallback(error + '');
      return false;
    }

    return false;
  }
}
