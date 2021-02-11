import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, ArrayNotEmpty, IsNumber } from 'class-validator';

export class AccumulateDto {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  numbers: number[];
}
