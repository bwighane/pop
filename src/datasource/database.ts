import { Products, Facilities } from './../models';
import { ConnectionOptions, createConnection, Connection } from 'typeorm';

export const connectToDatabase = async (
  name: string = 'default'
): Promise<any | Connection> => {
  const {
    DATABASE = 'dhis2-integration-mediator',
    DATABASE_HOST = 'localhost',
    DATABASE_PASSWORD = 'root',
    DATABASE_PORT = 3306,
    DATABASE_USERNAME = 'root',
  } = process.env;

  const options: ConnectionOptions = {
    name,
    database: DATABASE,
    entities: [Facilities, Products],
    host: DATABASE_HOST,
    password: DATABASE_PASSWORD,
    port: Number(DATABASE_PORT),
    type: 'mysql',
    username: DATABASE_USERNAME,
  };

  try {
    return createConnection(options);
  } catch (error) {
    console.log(error.message);
  }
};
