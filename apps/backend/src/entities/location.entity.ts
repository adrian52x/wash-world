import { IsInt, IsNotEmpty, IsPositive, IsString, Max, MaxLength } from 'class-validator';
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
  address: string;

  @Column({type: 'varchar', length: 255})
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @Column({ type: 'json' })
  opening_hours: OpeningHours;

  @Column({ type: 'int' })
  @IsInt()
  @IsPositive()
  auto_wash_halls_count: number;

  @Column({ type: 'int' })
  @IsInt()
  @IsPositive()
  self_wash_halls_count: number;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  latitude: number;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  longitude: number;
}
