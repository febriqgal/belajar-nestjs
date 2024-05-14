import { HttpException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationService } from 'src/common/validation.service';
import { PrismaService } from 'src/prisma.service';
import { Logger } from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prisma: PrismaService,
  ) {}
  async register(req: User): Promise<User> {
    this.logger.info(`Register user ${JSON.stringify(req)}`);
    const registerValidation: User = this.validationService.validate(
      UserValidation.REGISTER,
      req,
    );
    const totalUserWithSameEmail = await this.prisma.user.count({
      where: {
        email: registerValidation.email,
      },
    });

    if (totalUserWithSameEmail != 0) {
      throw new HttpException('Email already exist', 400);
    }
    registerValidation.password = await bcrypt.hash(
      registerValidation.password,
      10,
    );
    const user = await this.prisma.user.create({
      data: registerValidation,
    });
    return {
      name: user.name,
      email: user.email,
      id: user.id,
      password: user.password,
    };
  }

  async getAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }
}
