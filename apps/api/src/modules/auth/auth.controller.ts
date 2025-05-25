import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { isPublic } from 'src/shared/decorators/isPublic';
import { IAuthService } from './interface/auth-service.interface';
import { AUTH_SERVICE } from 'src/common/constants';

@isPublic()
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Post('login')
  authenticate(@Body() authDto: AuthDto) {
    return this.authService.authenticate(authDto);
  }

  @Post('register')
  create(@Body() signupDto: SignupDto) {
    return this.authService.create(signupDto);
  }
}
