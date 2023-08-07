import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'gtfs_ports' })
export default class GtfsPortModel extends Model<GtfsPortModel> {
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
  country: string;
}
