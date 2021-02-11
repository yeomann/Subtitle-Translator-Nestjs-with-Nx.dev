import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsArray,
  IsEmail,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from './base.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class Agent extends BaseEntity {
  @Index()
  @IsEmail({}, { always: true })
  @MaxLength(300, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text', unique: true })
  email: string;

  @Index()
  @IsString({ always: true })
  @MinLength(2, { always: true })
  @MaxLength(50, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text', unique: true })
  username: string;

  @IsString({ always: true })
  @MinLength(4, { always: true })
  @MaxLength(20, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text' })
  password?: string;

  @IsString({ always: true })
  @MinLength(2, { always: true })
  @MaxLength(300, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text' })
  fullName: string;

  @IsArray({ always: true })
  @IsIP(null, { always: true, each: true })
  @IsOptional({ always: true })
  @Column('text', { array: true, default: {}, nullable: true })
  ipWhiteList?: string[];

  // @Exclude({ toClassOnly: true })
  @IsOptional({ always: true })
  @Column('timestamptz', { nullable: true })
  lastPasswordChange?: Date;

  @IsString({ always: true })
  @IsOptional({ always: true })
  @Column({ type: 'text', nullable: true })
  accessToken?: string;
}
