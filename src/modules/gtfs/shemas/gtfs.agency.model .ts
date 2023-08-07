import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'gtfs_agencies' })
export default class GtfsAgencyModel extends Model<GtfsAgencyModel> {
  @Column({
    type: DataType.STRING,
    unique: true,
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
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timezone: string;

  @Column({ type: DataType.STRING })
  phone: string;
}
