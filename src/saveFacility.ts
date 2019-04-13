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
  facility.openLMISFaciliyCode = openLMISFacilityCode;
  facility.createdAt = new Date(Date.now());
  facility.updatedAt = new Date(Date.now());

  const facilityProduct = await connection.getRepository(Facilities).save(facility);
  info(facilityProduct);
};
