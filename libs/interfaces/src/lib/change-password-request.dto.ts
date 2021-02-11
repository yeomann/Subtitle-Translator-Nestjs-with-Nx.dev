import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePassRequest {
  @ApiProperty()
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  username: string;

  @ApiProperty()
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  password: string;

  @ApiProperty()
  @IsNotEmpty({ always: true })
  @IsString({ always: true })
  newPassword: string;
}
