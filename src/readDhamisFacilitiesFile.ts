import { DotenvParseOutput } from 'dotenv';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveFacility } from './saveFacility';


export const readDhamisFacilitiesFile = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const facilitiesFileName = '../data/DHIS2_DHAMIS_MAPPINGS.csv';
  const facilitiesFilePath = join(__dirname, '..', 'data', facilitiesFileName);

  if (!existsSync(facilitiesFilePath)) {
    error(`facilities file , "${facilitiesFilePath}", does not exist`);
    return;
  }

  const parser = parse({ delimiter: ',' }, async (err, facilities) => {
    if (err) {
      error(err.message);
      connection.close();
      return;
    }

    for (const facility of facilities) {
      const [, DHIS2OrganizationalUnitCode, dhamisFacilityCode] = facility;

      await saveFacility(
        connection,
        generate(),
        DHIS2OrganizationalUnitCode,
        undefined,
        dhamisFacilityCode
      );

    }
    connection.close();
  });

  await createReadStream(facilitiesFilePath).pipe(parser);
};
