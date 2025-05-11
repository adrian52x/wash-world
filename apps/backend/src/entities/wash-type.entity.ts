import { IsBoolean, IsNotEmpty, IsPositive } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('wash_types')
export class WashType {
  @PrimaryGeneratedColumn()
  wash_type_id: number;

  @Column()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  description: string;

  @Column()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @Column()
  @IsBoolean()
  is_auto_wash: boolean;
}
