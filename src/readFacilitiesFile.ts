import { join } from 'path';
import { existsSync, createReadStream } from 'fs';
import parse = require('csv-parse');
import { Connection } from 'typeorm';
import { generate } from 'shortid';
import { error } from 'winston';
import { saveFacility } from './saveFacility';

export const readFacilitiesFile = async (
    connection: Connection
): Promise<void> => {
    const filePath = join(__dirname, '..', 'data', 'mapped_facilities.csv');
    if (!existsSync(filePath)) {
        error(`facilities file , "${filePath}", does not exist`);
        process.exit(1);
    }

    const parser = parse(
        { delimiter: ',' },
        async (err, facilities) => {
            if (err) {
                error(err.message);
                connection.close();
                return;
            }

            for (const facility of facilities) {
                const [, ,
                    dhis2Id,
                    openlmisCode,
                    dhamisFacilityID,
                ] = facility;

                await saveFacility(
                    connection,
                    generate(),
                    dhis2Id,
                    openlmisCode,
                    dhamisFacilityID
                );
            }

            await connection.close();
        }
    );

    await createReadStream(filePath).pipe(parser);
};
