import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { WashType } from './wash-type.entity';
import { IsNotEmpty, IsPositive } from 'class-validator';

@Entity('memberships')
export class Membership {
  @PrimaryGeneratedColumn()
  membership_id: number;

  @Column()
  @IsNotEmpty()
  @IsPositive()
  price: number;
  
  @OneToOne(() => WashType)
  @JoinColumn({ name: 'wash_type_id' })
  washType: WashType;
}
