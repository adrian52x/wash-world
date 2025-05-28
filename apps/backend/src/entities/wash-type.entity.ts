import { IsBoolean, IsEnum, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { WashTypeEnum } from '../utils/enums';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wash_types')
export class WashType {
  @PrimaryGeneratedColumn()
  wash_type_id: number;

  @Column({
    type: 'enum',
    enum: WashTypeEnum,
  })
  @IsNotEmpty()
  @IsEnum(WashTypeEnum)
  type: WashTypeEnum;

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
