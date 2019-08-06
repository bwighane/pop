import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Products' })
export class Products {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public productCode: string;

  @Column()
  public dataElementCode: string;

  @Column()
  public openLMISCode: string;

  @Column()
  public dhamisCode: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;
}
