import { Controller, Get, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { activeUserId } from 'src/shared/decorators/activeUserId';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  async me(@Req() request: Request, @activeUserId() userId: string) {
    return await this.usersService.getUserById(userId);
  }
}
