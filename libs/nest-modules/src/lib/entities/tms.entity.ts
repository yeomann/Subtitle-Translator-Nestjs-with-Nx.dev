import { CrudValidationGroups } from '@nestjsx/crud';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { LanguageEnum } from '@subtitles-translator/enums';
import { BaseEntity } from '@subtitles-translator/entities';

const { CREATE, UPDATE } = CrudValidationGroups;

// Adding TMS entity as per the example json below
// {
//   "source": "Hello World",
//   "target": "Hallo Welt",
//   "sourceLanguage": "en",
//   "targetLanguage": "de"
// },
@Entity()
@Index(['sourceLanguage', 'targetLanguage'], {})
export class TMS extends BaseEntity {
  @ApiProperty({
    enum: LanguageEnum,
  })
  @IsEnum(LanguageEnum, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text', nullable: false })
  sourceLanguage: LanguageEnum; // using enum, To prevent any accedential wrong language Locale

  @ApiProperty({
    enum: LanguageEnum,
  })
  @IsEnum(LanguageEnum, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text', nullable: false })
  targetLanguage: LanguageEnum;

  @IsString({ always: true })
  @MinLength(1, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text' })
  target: string;

  @IsString({ always: true })
  @MinLength(1, { always: true })
  @IsOptional({ groups: [UPDATE] })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ type: 'text' })
  source: string;
}
