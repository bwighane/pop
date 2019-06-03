import { Connection } from 'typeorm';
import { Facilities } from './models';
import { info } from 'winston';

export const saveFacility = async (
  connection: Connection,
  facilityCode: string,
  DHIS2OrganizationalUnitCode: string,
  openLMISFacilityCode: string
): Promise<void> => {
  const facility = new Facilities();

  facility.facilityCode = facilityCode;
  facility.DHIS2OrganizationalUnitCode = DHIS2OrganizationalUnitCode;
  facility.openLMISFacilityCode = openLMISFacilityCode;

  const savedFacility = await connection.getRepository(Facilities).save(facility);

  info(`created facility: ${savedFacility.facilityCode}`);
  console.log(JSON.stringify(savedFacility, undefined, 2));
  console.log();
};
