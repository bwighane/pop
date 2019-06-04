import 'reflect-metadata';

import { join } from 'path';
import { existsSync } from 'fs';
import { add, transports, format, error } from 'winston';

import { loadConfig } from './config';
import { connectToDatabase } from './datasource';
import { readProductsFile } from './readProductsFile';
import { readFacilitiesFile } from './readFacilitiesFile';

const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.label({ label: '[populator]' }),
  format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
  format.printf(info => {
    return `${info.label} ${info.timestamp} ${info.level} : ${info.message}`;
  })
);

const main = async () => {
  const console = new transports.Console({ format: consoleFormat });
  add(console);

  const envPath = join(__dirname, '..', '.env');

  if (!existsSync(envPath)) {
    error(`Env file is require`);
    process.exit(1);
  }

  const config = await loadConfig(envPath);

  await readProductsFile(config, await connectToDatabase(config, 'default'));
  await readFacilitiesFile(config, await connectToDatabase(config, 'work'));
};

main();
