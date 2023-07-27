import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import GtfsAgencyModel from './gtds.agency.model ';

@Table({ tableName: 'gtfs_routes' })
export default class GtfsRouteModel extends Model<GtfsRouteModel> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    primaryKey: true,
    //autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => GtfsAgencyModel)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  agency: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_origin_name: string;

  /* @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_origin_id: string; */

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_destination_name: string;

  /* @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_destination_id: string; */

  @Column({ type: DataType.STRING })
  departure_time: string;

  @Column({ type: DataType.STRING })
  arrival_time: string;

  @Column({ type: DataType.STRING })
  intermediary: string;

  @Column({ type: DataType.STRING })
  desc: string;

  @Column({ type: DataType.INTEGER })
  route_type: number;

  @BelongsTo(() => GtfsAgencyModel)
  company: GtfsAgencyModel;
}
