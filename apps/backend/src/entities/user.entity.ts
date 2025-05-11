import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../utils/enums';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  @IsNotEmpty()
  username: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @Column()
  address: string;

  @Column()
  phone_number: string;

  @Column()
  license_plate: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.RegularUser,
  })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
