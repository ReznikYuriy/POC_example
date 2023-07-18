import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import LocationModel from './location.model';

@Table({ tableName: 'routes' })
export default class RouteModel extends Model<RouteModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => LocationModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_origin: string;

  @ForeignKey(() => LocationModel)
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

  @BelongsTo(() => LocationModel, 'loc_origin')
  loc_orig: LocationModel;

  @BelongsTo(() => LocationModel, 'loc_destination')
  loc_dest: LocationModel;
}
