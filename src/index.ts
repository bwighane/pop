import 'reflect-metadata';

import { join } from 'path';
import { existsSync } from 'fs';
import { add, transports, error } from 'winston';

import { loadConfig } from './config';
import { connectToDatabase } from './datasource';
import { readFile } from './readFile';

const exit = process.exit;

const main = async () => {
  const console = new transports.Console();
  add(console);

  const envPath = join(__dirname, '..', '.env');

  if (!existsSync(envPath)) {
    error(`Env file is require`);
    exit(1);
  }

  const config = await loadConfig(envPath);
  const connection = await connectToDatabase(config);

  await readFile(config, connection);
};

main();
