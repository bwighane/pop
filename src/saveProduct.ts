import { Connection } from 'typeorm';
import { Products } from './models';
import { info, error } from 'winston';

export const saveProduct = async (
  connection: Connection,
  productCode: string,
  dataElementCode: string,
  openLMISCode: string,
  dhamisCode: string
): Promise<void> => {
  const product = new Products();

  product.productCode = productCode;
  product.openLMISCode = openLMISCode;
  product.dhamisCode = dhamisCode;
  product.dataElementCode = dataElementCode;
  product.createdAt = new Date(Date.now());
  product.updatedAt = new Date(Date.now());

  try {
    const savedProduct = await connection.getRepository(Products).save(product);
    info(`created product: ${savedProduct.productCode}`);
    console.log(JSON.stringify(savedProduct, undefined, 2));
  } catch (err) {
    error(err.message);
  }

  console.log();
};
