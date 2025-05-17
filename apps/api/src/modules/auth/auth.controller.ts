import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { isPublic } from 'src/shared/decorators/isPublic';

@isPublic()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  authenticate(@Body() authDto: AuthDto) {
    return this.authService.authenticate(authDto);
  }

  @Post('register')
  create(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }
}
