import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Client' })
export class Client {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;
}
