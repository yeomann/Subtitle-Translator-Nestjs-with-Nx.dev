import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPassRequest {
  @ApiProperty()
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  newPassword: string;
}
