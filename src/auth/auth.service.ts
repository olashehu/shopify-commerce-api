/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as shortid from 'shortid';
import { User } from 'src/models/user.model';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserRole } from 'src/models/user.model';

@Injectable()
export class AuthService {
  private userRepo: Repository<User>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    this.userRepo = this.entityManager.getRepository(User);
  }

  async signIn(data: { email: string; password: string }) {
    try {
      const { email, password } = data;
      // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
      const isEmail: UserDTO | any = await this.userRepo.findOne({
        where: {
          email,
        },
      });

      if (!isEmail) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email or password not match',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const isMatch = await bcrypt.compare(password, isEmail?.password);

      if (!isMatch) {
        return { status: 400, error: 'Email or password not match' };
      }

      const payload = { sub: isEmail.id, username: isEmail.userName };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error(error);
    }
  }

  async createUser(data: UserDTO) {
    try {
      const user = await this.userRepo.save({
        id: shortid(),
        userName: data.userName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        password: data.password,
        isActive: true,
      });
      const payload = { sub: user.id, username: user.userName };
      return {
        usaername: user.userName,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let error = 'Internal server error';
      if (err.status === HttpStatus.NOT_FOUND) {
        status = HttpStatus.NOT_FOUND;
        error = err.response.error;
      }
      throw new HttpException(
        {
          status,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createSeller(data: UserDTO) {
    try {
      const user = await this.userRepo.save({
        id: shortid(),
        userName: data.userName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        role: UserRole.SELLER,
        password: data.password,
        isActive: true,
      });
      const payload = { sub: user.id, username: user.userName };
      return {
        usaername: user.userName,
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let error = 'Internal server error';
      if (err.status === HttpStatus.NOT_FOUND) {
        status = HttpStatus.NOT_FOUND;
        error = err.response.error;
      }
      throw new HttpException(
        {
          status,
          error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async logoutUser(user: {
    sub: string;
    username: string;
    iat: string;
    exp: string;
  }) {
    try {
      const id = user?.sub;
      const result = await this.userRepo.update(id, {
        isActive: false,
      });
      if (result.affected === 0) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      console.log(error);
    }
  }
}
