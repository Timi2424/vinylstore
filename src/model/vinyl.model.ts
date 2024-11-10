import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript';
import { Review } from './review.model';

@Table
export class Vinyl extends Model<Vinyl> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  artist: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @HasMany(() => Review)
  reviews: Review[];
}
