import { Products } from './../models';
import { DotenvParseOutput } from 'dotenv';

import { ConnectionOptions, createConnection, Connection } from 'typeorm';

export const connectToDatabase = async (
  config: DotenvParseOutput
): Promise<Connection> => {
  const options: ConnectionOptions = {
    database: config.DATABASE || 'dhis2-integration-mediator',
    entities: [Products],
    host: config.DATABASE_HOST || 'localhost',
    password: config.DATABASE_PASSWORD || '',
    port: Number(config.DATABASE_PORT) || 3306,
    type: 'mysql',
    username: config.DATABASE_USERNAME || 'root',
  };

  return createConnection(options);
};
