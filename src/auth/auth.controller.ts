import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto, ForgetPwDto, ResetPwDto } from './dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 403, description: 'Credentials already taken' })
  signup(@Body() dto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 403, description: 'Invalid credentials' })
  signin(@Body() dto: SignInDto): Promise<{ token: string }> {
    return this.authService.signin(dto);
  }

  @Post('forgetPassword')
  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 403, description: 'User not found' })
  forgetPassword(@Body() dto: ForgetPwDto): Promise<{ message: string }> {
    return this.authService.forgetPassword(dto);
  }

  @Patch('resetPassword/:token')
  @ApiOperation({ summary: 'Reset password with token' })
  @ApiResponse({ status: 200, description: 'Password successfully reset' })
  @ApiResponse({ status: 403, description: 'Invalid or expired token' })
  resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPwDto,
  ): Promise<{ token: string }> {
    return this.authService.resetPassword(token, dto);
  }
}
