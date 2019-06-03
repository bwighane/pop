import { DotenvParseOutput } from 'dotenv';
import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveFacility } from './saveFacility';

const getOpenLMISFacilityCode = (records, name) => {
  for (const record of records) {
    const [, , facilityName, , , code] = record;
    if (facilityName.trim().toLowerCase() === name.trim().toLowerCase()) {
      return code;
    }
  }
  return undefined;
};

export const readFacilitiesFile = async (
  config: DotenvParseOutput,
  connection: Connection
): Promise<void> => {
  const facilitiesFileName = config.FACILITIES_FILE_NAME || '../data/facilities.csv';

  const facilitiesFilePath = join(__dirname, '..', 'data', facilitiesFileName);

  if (!existsSync(facilitiesFilePath)) {
    error(`facilities file , "${facilitiesFilePath}", does not exist`);
    process.exit(1);
  }

  const parser = parse({ delimiter: ',' }, async (err, facilities) => {
    if (err) {
      error(err.message);
      connection.close();
      return;
    }

    await createReadStream(
      join(__dirname, '..', 'data', config.OPEN_LMIS_FACILITIES_FILE_NAME)
    ).pipe(
      parse(
        { delimiter: ',' },
        async (e, openLMISfacilities) => {
          if (e) {
            error(e.message);
            connection.close();
            return;
          }

          for (const facility of facilities) {
            const [name, DHIS2OrganizationalUnitCode] = facility;

            const openLMISFacilityCode = await getOpenLMISFacilityCode(
              openLMISfacilities,
              name
            );

            await saveFacility(
              connection,
              generate(),
              DHIS2OrganizationalUnitCode,
              openLMISFacilityCode
            );

          }

          connection.close();
        })
    );
  });

  await createReadStream(facilitiesFilePath).pipe(parser);
};
