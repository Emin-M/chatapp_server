import { IsEmail } from 'class-validator';

export class ForgetPwDto {
  @IsEmail()
  email: string;
}
