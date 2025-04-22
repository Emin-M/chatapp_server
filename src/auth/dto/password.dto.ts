import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPwDto {
  @ApiProperty({
    description: 'User email for password reset',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPwDto {
  @ApiProperty({
    description: 'New password (min 8 characters, must contain uppercase, lowercase, and number/special character)',
    example: 'NewPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  password: string;
}
