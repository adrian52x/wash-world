import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../utils/enums';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  address: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
  phone_number: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  @IsOptional()
  @IsString()
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