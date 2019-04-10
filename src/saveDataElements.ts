import { Connection } from 'typeorm';
import { Products } from './models';
import { info } from 'winston';

export const saveDataElements = async (
  connection: Connection,
  productCode: string,
  dataElementCode: string,
  openLMISCode: string
): Promise<void> => {
  const product = new Products();
  product.productCode = productCode;
  product.openLMISCode = openLMISCode;
  product.dataElementCode = dataElementCode;

  const savedProduct = await connection.getRepository(Products).save(product);
  info(savedProduct);
};
