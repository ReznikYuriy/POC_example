import { Column, DataType, Default, Model, Table } from 'sequelize-typescript';
import BookingPriceInterface from './booking.price.interface';

@Table({ tableName: 'bookings' })
export default class BookingModel extends Model<BookingModel> {
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
  loc_origin_code: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  loc_destination_code: string;

  @Column({ type: DataType.DATE })
  departure_date_time: Date;

  @Column({ type: DataType.DATE })
  arrival_date_time: Date;

  @Column({ type: DataType.STRING })
  vessel_id: string;

  @Column({
    type: DataType.STRING,
  })
  company_code: string;

  @Default([])
  @Column({
    type: DataType.ARRAY(DataType.JSONB),
  })
  prices: BookingPriceInterface[];

  @Column({
    type: DataType.STRING,
  })
  bookingIdentifier: string;
}
