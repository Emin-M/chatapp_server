import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions/forbidden.exception';
import * as argon from 'argon2';
import { ConfigService } from '@nestjs/config/dist';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgetPwDto, SignInDto, SignUpDto } from './dto';
import { Prisma } from '@prisma/client';
import { createHash, randomBytes } from 'crypto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
    private jwt: JwtService,
    private readonly mailservice: MailService,
  ) {}

  //! signup
  async signup(dto: SignUpDto) {
    try {
      //^ hash password
      const hashedPassword = await argon.hash(dto.password);

      //^ saving user in db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          userName: dto.userName,
        },
      });

      //^ send welcome email
      await this.mailservice.sendWelcomeMail(user.email, dto.userName);

      //^ login the user
      return this.generateToken(user.id);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  //! signin
  async signin(dto: SignInDto) {
    try {
      //^ checking if user exist
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      //^ checking password
      const isPwCorrect = await argon.verify(user.password, dto.password);

      //^ if user does not exist or password incorrect throw exception
      if (!user || !isPwCorrect)
        throw new ForbiddenException('Credentials incorrect!');

      //^ login the user
      return this.generateToken(user.id);
    } catch (error) {
      throw error;
    }
  }

  //! forgetPassword
  async forgetPassword(dto: ForgetPwDto) {
    try {
      //^ checking if user exist
      const user = await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
      });

      if (!user)
        throw new ForbiddenException('User does not exist with given email!');

      //^ generate reset token
      const token = randomBytes(12).toString('hex');
      const hashedToken = createHash('md5').update(token).digest('hex');

      //^ updating user
      await this.prisma.user.update({
        where: {
          email: dto.email,
        },
        data: {
          resetToken: hashedToken,
          tokenValidTime: Date.now() + 15 * 60 * 1000,
        },
      });

      //^ sending email
      await this.mailservice.sendUserConfirmation(dto.email, token);

      return {
        message: 'Email sent!',
      };
    } catch (error) {
      throw error;
    }
  }

  //! genereting token
  async generateToken(userId: number): Promise<{ token: string }> {
    const payload = {
      sub: userId,
    };

    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRES'),
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      token,
    };
  }
}
