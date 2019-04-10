import { DotenvParseOutput } from 'dotenv';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveDataElements } from './saveDataElements';

const exit = process.exit;

export const readFile = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const dataElementFileName = config.DATA_ELEMENTS_FILE_NAME;

  const dataElementsFilePath = join(
    __dirname,
    '..',
    'data',
    dataElementFileName
  );

  if (!existsSync(dataElementsFilePath)) {
    error('data elemets file does not exist');
    exit(1);
  }

  const parser = parse({ delimiter: ',' }, async (err, dataElements) => {
    if (err) {
      error(err.message);
      connection.close();
      return;
    }

    for (const dataElement of dataElements) {
      const [, openLMISproductCode, , dataDHIS2ElementCode] = dataElement;

      await saveDataElements(
        connection,
        generate(),
        openLMISproductCode,
        dataDHIS2ElementCode
      );
    }

    connection.close();
  });

  await createReadStream(dataElementsFilePath).pipe(parser);
};
