import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { WebResponse } from 'src/model/web.model';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAll(): Promise<WebResponse<User[]>> {
    const result = await this.userService.getAll().then((data) => data);
    return {
      data: result,
      message: 'Get all user success',
      statusCode: 200,
    };
  }

  @Post()
  async register(@Body() req: User): Promise<WebResponse<User>> {
    const result = await this.userService.register(req);
    return {
      data: result,
      message: 'Register success',
      statusCode: 200,
    };
  }
}
