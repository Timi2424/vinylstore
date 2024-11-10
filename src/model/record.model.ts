import {
    Table,
    Column,
    Model,
    DataType,
    HasMany,
  } from 'sequelize-typescript';
import { Review } from './review.model';

  
  @Table
  export class VinylRecord extends Model<VinylRecord> {
    @Column({
      type: DataType.UUID,
      defaultValue: DataType.UUIDV4,
      primaryKey: true,
    })
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
  