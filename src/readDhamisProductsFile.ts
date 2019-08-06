import { DotenvParseOutput } from 'dotenv';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveProduct } from './saveProduct';

export const readDhamisProductsFile = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const productsFileName = '../data/artdataelements.csv';

  const productsFilePath = join(
    __dirname,
    '..',
    'data',
    productsFileName
  );

  if (!existsSync(productsFilePath)) {
    error(`products file, "${productsFilePath}", does not exist`);
    process.exit(1);
  }

  const parser = parse({ delimiter: ',' }, async (err, products) => {
    if (err) {
      error(err.message);
      connection.close();
      return;
    }

    for (const product of products) {
      const [, dhamisCode, , dataDHIS2ElementCode] = product;

      if (!dhamisCode) {
        continue;
      }

      await saveProduct(
        connection,
        generate(),
        dataDHIS2ElementCode,
        undefined,
        dhamisCode
      );
    }

    connection.close();
  });

  await createReadStream(productsFilePath).pipe(parser);
};
