import { Table, Column, Model, DataType, PrimaryKey } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Column(DataType.STRING)
  auth0Id: string;

  @Column(DataType.STRING)
  firstName: string;

  @Column(DataType.STRING)
  lastName: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.DATE)
  birthdate: Date;

  @Column(DataType.STRING)
  avatar: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'user',
  })
  role: string;
}
