import { join } from 'path';
import { existsSync } from 'fs';
import { error } from 'winston';

import { loadConfig } from './config';
import { connectToDatabase } from './datasource';
import { readOpenlmisProductsFile } from './readProductsFile';
import { readFacilitiesFile } from './readFacilitiesFile';
import { readDhamisProductsFile } from './readDhamisProductsFile';
// import { readDhamisFacilitiesFile } from './readDhamisFacilitiesFile';

import { truncate } from './truncate';
import { addLogging } from './Logging';

export const main = async () => {
  addLogging();
  const envPath = join(__dirname, '..', '.env');

  if (!existsSync(envPath)) {
    error(`Env file is require`);
    process.exit(1);
  }

  await loadConfig(envPath);

  await truncate(await connectToDatabase('Truncate_Products'), 'Products');
  await truncate(await connectToDatabase('Truncate_Facilities'), 'Facilities');

  await readOpenlmisProductsFile(await connectToDatabase('OpenLMIS_Products'));
  await readFacilitiesFile(await connectToDatabase('OpenLMIS_Facilities'));
  await readDhamisProductsFile(await connectToDatabase('dhamis_Products'));
};
