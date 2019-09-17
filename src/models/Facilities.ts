import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'facilities' })
export class Facilities {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public facilityCode: string;

  @Column()
  public DHIS2OrganizationalUnitCode: string;

  @Column()
  public openLMISFacilityCode: string;

  @Column()
  public dhamisFacilityCode: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;
}
