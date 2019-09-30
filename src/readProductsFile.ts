import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveProduct } from './saveProduct';

export const readOpenlmisProductsFile = async (
  connection: Connection
): Promise<void> => {

  const {
    PRODUCTS_FILE_NAME = '../data/products.csv',
  } = process.env;

  const productsFilePath = join(
    __dirname,
    '..',
    'data',
    PRODUCTS_FILE_NAME
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

    for (const dataElement of products) {
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
