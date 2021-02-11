import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { MailQueueLogStatusEnum } from '@subtitles-translator/enums';
import { BaseEntity } from './base.entity';

const { CREATE, UPDATE } = CrudValidationGroups;

@Entity()
export class MailQueueLog extends BaseEntity {
  @Index()
  @Column('text', { nullable: true })
  jobId?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @MaxLength(300, { always: true })
  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  jobProcessName: string;

  @IsEnum(MailQueueLogStatusEnum, { always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column('text', { nullable: true })
  jobStatus?: MailQueueLogStatusEnum;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailTo?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailFrom?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailSubject?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailHtml?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailSentSucessId?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailFailMessage?: string;

  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'text', nullable: true })
  emailFailStack?: string;
}
