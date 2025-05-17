import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WashType } from './wash-type.entity';
import { IsEnum, IsNotEmpty, IsPositive } from 'class-validator';
import { MembershipTypeEnum } from 'src/utils/enums';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  membership_id: number;

  @Column({
    type: 'enum',
    enum: MembershipTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(MembershipTypeEnum)
  type: MembershipTypeEnum;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @OneToOne(() => WashType)
  @JoinColumn({ name: 'wash_type_id' })
  washType: WashType;
}
