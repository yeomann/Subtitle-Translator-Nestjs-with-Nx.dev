import { ApiProperty } from '@nestjs/swagger';

export class LoginResponse {
  @ApiProperty() accessToken: string;
  @ApiProperty() username: string;
  @ApiProperty() id: string;
  @ApiProperty() lastPasswordChange: Date;
}
