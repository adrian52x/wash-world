import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WashType } from './wash-type.entity';
import { Location } from './location.entity';
import { IsDateString, IsNotEmpty } from 'class-validator';

@Entity('washes')
export class Wash {
  @PrimaryGeneratedColumn()
  wash_id: number;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => WashType)
  @JoinColumn({ name: 'wash_type_id' })
  washType: WashType;

  @ManyToOne(() => Location)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'timestamp' })
  @IsNotEmpty()
  @IsDateString()
  date_time: Date;
}
