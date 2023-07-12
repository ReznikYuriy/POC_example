import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'locations' })
export default class LocationModel extends Model<LocationModel> {
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
