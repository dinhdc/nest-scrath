import { ConfigService } from '@nestjs/config';
import { rm } from 'fs/promises';
import { join } from 'path';
import { Report } from '../src/reports/report.entity';
import { User } from '../src/users/user.entity';
import { DataSource } from 'typeorm';

const initializeDatabase = async () => {
  const config = new ConfigService();
  const app = new DataSource({
    type: 'sqlite',
    database: config.get<string>('DB_NAME'),
    synchronize: true,
    entities: [User, Report],
  });
  await app.initialize();
};

global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch (error) {}
});

global.afterEach(async () => {
  await initializeDatabase();
});
