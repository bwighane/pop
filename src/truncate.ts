'use strict';

import { Connection } from 'typeorm';

const { log, error } = console;

export const truncate = async (
  connection: Connection,
  modelName: string
): Promise<void> => {

  const entities = connection.entityMetadatas;
  const foundEntity = entities.find(entity => entity.name == modelName);

  if (!foundEntity) {
    error('😡', `${modelName}`);
    return;
  }

  try {
    const repository = await connection.getRepository(foundEntity.name);
    await repository.query(`TRUNCATE TABLE \`${foundEntity.tableName}\`;`);
  } catch (err) {
    error('😡', err.message);
    return;
  }

  log(`${foundEntity.name} truncated successfully`);
  connection.close();
};
