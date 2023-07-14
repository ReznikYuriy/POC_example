import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'trips' })
export default class TripModel extends Model<TripModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_origin: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_destination: string;

  @Column({ type: DataType.DATE })
  date_start: Date;

  @Column({ type: DataType.DATE })
  date_end: Date;

  @Column({ type: DataType.INTEGER })
  duration: number;

  @Column({
    type: DataType.STRING,
  })
  company: string;

  @Column({ type: DataType.INTEGER })
  price_basic: number;

  @Column({ type: DataType.INTEGER })
  price_discount: number;
}
