import { DotenvParseOutput } from 'dotenv';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveProduct } from './saveProduct';


export const readOpenlmisProductsFile = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {

  const productsFileName = config.PRODUCTS_FILE_NAME || '../data/products.csv';

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

  const parser = parse({ delimiter: ',' }, async (err, productts) => {
    if (err) {
      error(err.message);
      connection.close();
      return;
    }

    for (const dataElement of productts) {
      const [, openLMISproductCode, , dataDHIS2ElementCode] = dataElement;

      if (!openLMISproductCode || openLMISproductCode === 'Code') {
        continue;
      }

      await saveProduct(
        connection,
        generate(),
        dataDHIS2ElementCode,
        openLMISproductCode,
        undefined
      );
    }

    await connection.close();
  });

  await createReadStream(productsFilePath).pipe(parser);
};
