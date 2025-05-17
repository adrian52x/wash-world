import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';
import { OpeningHours } from 'src/utils/types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  location_id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  opening_hours: string;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  auto_wash_halls: number;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @IsPositive()
  self_wash_halls: number;

  @Column({ type: 'json' })
  coordinates: JSON;
}
