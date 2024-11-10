import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
  } from 'sequelize-typescript';
import { VinylRecord } from './record.model';
import { User } from './user.model';

  
  @Table
  export class Review extends Model<Review> {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
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
      type: DataType.UUID,
      allowNull: false,
    })
    userId: string;
  
    @BelongsTo(() => User)
    user: User;
  
    @ForeignKey(() => VinylRecord)
    @Column({
      type: DataType.UUID,
      allowNull: false,
    })
    vinylRecordId: string;
  
    @BelongsTo(() => VinylRecord)
    vinylRecord: VinylRecord;
  }
  