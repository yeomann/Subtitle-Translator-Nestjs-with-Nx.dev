import { AuthAgent } from '@subtitles-translator/decorators';
import {
  ChangePassRequest,
  LoginRequest,
  LoginResponse,
  ResetPassRequest,
} from '@subtitles-translator/interfaces';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { getValue } from 'express-ctx';

@ApiTags('Login')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // login uses our local gaurd that is defined in the core-modules
  // no bearer, Open endpoint
  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiBody({ type: LoginRequest })
  @ApiResponse({ type: LoginResponse })
  @HttpCode(HttpStatus.OK)
  login(@AuthAgent() agent: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(agent);
  }

  // no bearer, Open endpoint
  @Post('changepass')
  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePassRequest })
  @ApiResponse({ type: LoginResponse })
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() data: ChangePassRequest): Promise<LoginResponse> {
    return this.authService.changePassword(data);
  }

  // guarded with bearer
  @ApiBearerAuth()
  @Post('resetpass')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPassRequest })
  @ApiResponse({ type: LoginResponse })
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() data: ResetPassRequest): Promise<LoginResponse> {
    return this.authService.resetPassword(data);
  }

  // test method as if the requested users bearer is valid
  @ApiBearerAuth()
  @Get('checktoken')
  checkToken(): Promise<{ status: string }> {
    const getReqContext = getValue('req');
    const headersAccessToken = getReqContext.accessToken;
    const agentUsername = getReqContext.user.username;
    console.log(headersAccessToken, agentUsername);
    return this.authService.validateAccessToken(
      headersAccessToken,
      agentUsername
    );
  }
}
