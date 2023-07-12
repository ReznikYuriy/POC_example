import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'routes' })
export default class RouteModel extends Model<RouteModel> {
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}
