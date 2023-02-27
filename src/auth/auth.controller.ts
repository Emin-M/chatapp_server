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

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignUpDto): Promise<{ token: string }> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SignInDto): Promise<{ token: string }> {
    return this.authService.signin(dto);
  }

  @Post('forgetPassword')
  forgetPassword(@Body() dto: ForgetPwDto): Promise<{ message: string }> {
    return this.authService.forgetPassword(dto);
  }

  @Patch('resetPassword/:token')
  resetPassword(
    @Param('token') token: string,
    @Body() dto: ResetPwDto,
  ): Promise<{ token: string }> {
    return this.authService.resetPassword(token, dto);
  }
}
