import { IsBoolean, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wash_types')
export class WashType {
  @PrimaryGeneratedColumn()
  wash_type_id: number;

  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ type: 'varchar', length: 1024 })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ type: 'decimal', precision: 6, scale: 2 })
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @Column({ type: 'boolean' })
  @IsNotEmpty()
  @IsBoolean()
  is_auto_wash: boolean;
}