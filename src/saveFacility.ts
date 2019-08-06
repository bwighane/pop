import { Connection } from 'typeorm';
import { Facilities } from './models';
import { info, error } from 'winston';

export const saveFacility = async (
  connection: Connection,
  facilityCode: string,
  DHIS2OrganizationalUnitCode: string,
  openLMISFacilityCode: string,
  dhamisFacilityCode: string
): Promise<void> => {
  const facility = new Facilities();

  facility.facilityCode = facilityCode;
  facility.DHIS2OrganizationalUnitCode = DHIS2OrganizationalUnitCode;
  facility.dhamisFacilityCode = dhamisFacilityCode;
  facility.openLMISFacilityCode = openLMISFacilityCode;

  try {
    const savedFacility = await connection.getRepository(Facilities).save(facility);
    info(`created facility: ${savedFacility.facilityCode}`);
    console.log(JSON.stringify(savedFacility, undefined, 2));
  } catch (err) {
    error(err.message);
  }
  console.log();
};
