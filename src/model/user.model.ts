import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

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

  @Default('user')
  @Column(DataType.STRING)
  role: string;
}
