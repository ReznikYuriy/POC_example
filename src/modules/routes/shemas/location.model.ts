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

  /* @BelongsTo(() => User)
  user: User;

  @HasOne(() => ShippingEstimate)
  shipping_estimate: ShippingEstimate;

  @HasMany(() => TrackingStatusLog)
  tracking_status_logs: TrackingStatusLog[];

  @HasMany(() => Trip)
  trips: Trip[];
  @HasOne(() => PallexError)
  pallex_error: PallexError | null;

  @HasMany(() => RequestStatusLog)
  status_logs: RequestStatusLog[];

  @BelongsToMany(() => Contractor, {
    through: { model: () => ResContract },
  })
  contractor: Contractor[];

  @BelongsToMany(() => Contractor, {
    through: { model: () => ResSubContract },
  })
  sub_contractor: Contractor[]; */
}
