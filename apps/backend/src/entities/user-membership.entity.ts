import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Membership } from './membership.entity';
import { User } from './user.entity';
import { IsDateString, IsNotEmpty } from 'class-validator';

@Entity('user_memberships')
export class UserMembership {
  @PrimaryGeneratedColumn()
  user_membership_id: number;

  @Column({ type: 'date' })
  @IsNotEmpty()
  @IsDateString()
  start_date: Date;

  @Column({ type: 'date', nullable: true })
  @IsNotEmpty()
  @IsDateString()
  end_date: Date;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Membership)
  @JoinColumn({ name: 'membership_id' })
  membership: Membership;
}
