/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NestMiddleware,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.model';
import { UserDTO } from 'src/user/user.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const dtoObject = plainToInstance(UserDTO, req.body);
    const errors = await validate(dtoObject);

    if (errors.length < 0) {
      const messages = errors
        .map((err) => Object.values(err.constraints as never))
        .flat();
      throw new BadRequestException(messages);
    }

    const { email, phoneNumber, password } = req.body as never;
    const [isEmail, isPhoneNumber] = await Promise.all([
      this.userRepository.findOne({
        where: {
          email,
        },
      }),
      this.userRepository.findOne({
        where: {
          phoneNumber,
        },
      }),
    ]);

    if (isEmail) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: 'email or phone number already exist' });
    } else if (isPhoneNumber) {
      return res
        .status(HttpStatus.CONFLICT)
        .json({ error: 'email or phone number already exist' });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      next();
    }
  }
}
