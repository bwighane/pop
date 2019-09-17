import 'reflect-metadata';

import { join } from 'path';
import { existsSync } from 'fs';
import { add, transports, format, error } from 'winston';

import { loadConfig } from './config';
import { connectToDatabase } from './datasource';
import { readOpenlmisProductsFile } from './readProductsFile';
import { readOpenLmisFacilitiesFile } from './readFacilitiesFile';
import { readDhamisProductsFile } from './readDhamisProductsFile';
import { readDhamisFacilitiesFile } from './readDhamisFacilitiesFile';

import { truncate } from './truncate';

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

  await truncate(
    await connectToDatabase(config, 'Truncate_Products'),
    'Products'
  );

  await truncate(
    await connectToDatabase(config, 'Truncate_Facilities'),
    'Facilities'
  );

  await readOpenlmisProductsFile(
    config,
    await connectToDatabase(config, 'OpenLMIS_Products')
  );

  await readOpenLmisFacilitiesFile(
    config,
    await connectToDatabase(config, 'OpenLMIS_Facilities')
  );

  await readDhamisProductsFile(
    config,
    await connectToDatabase(config, 'dhamis_Products')
  );

  await readDhamisFacilitiesFile(
    config,
    await connectToDatabase(config, 'dhamis_Facilities')
  );
};

main();
console.log();
