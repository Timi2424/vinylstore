import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { Vinyl } from './vinyl.model';
import { User } from './user.model';

@Table
export class Review extends Model<Review> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  auth0Id: string;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Vinyl)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  vinylId: string;

  @BelongsTo(() => Vinyl)
  vinyl: Vinyl;
}
