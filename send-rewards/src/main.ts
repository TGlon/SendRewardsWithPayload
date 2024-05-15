import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransactionSchedulerService } from './schedule/scheduleFetchTransactions'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const schedulerService = app.get(TransactionSchedulerService);
  await schedulerService.scheduleFetchTransactions();
  await app.listen(3000);
}
bootstrap();
