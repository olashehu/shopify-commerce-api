/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import * as shortid from 'shortid';
import { User } from 'src/user/user.model';
import { LoginDto, UserDTO } from 'src/user/user.dto';
import { UserRole } from 'src/user/user.model';

@Injectable()
export class AuthService {
  private userRepo: Repository<User>;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private jwtService: JwtService,
  ) {
    this.userRepo = this.entityManager.getRepository(User);
  }

  async createUser(createDto: UserDTO) {
    try {
      const userRole =
        createDto.role === 'admin'
          ? UserRole.ADMIN
          : createDto.role === 'seller'
            ? UserRole.SELLER
            : UserRole.BUYER;
      const newUser = this.userRepo.create({
        id: shortid(),
        userName: createDto.userName,
        email: createDto.email,
        phoneNumber: createDto.phoneNumber,
        role: userRole,
        password: createDto.password,
        isActive: true,
      });
      const user = await this.userRepo.save(newUser);
      const payload = {
        sub: user.id,
        username: user.userName,
        email: user.email,
        phone: user.phoneNumber,
        role: user.role,
      };
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

  async signIn(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
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

      const isMatch = await bcrypt.compare(
        password,
        isEmail.password as string,
      );

      if (!isMatch) {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Email or password not match',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const payload = {
        sub: isEmail.id,
        username: isEmail.userName,
        email: isEmail.email,
        phone: isEmail.phoneNumber,
        role: isEmail.role,
      };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (err) {
      if (err instanceof HttpException) {
        throw err;
      }

      console.error('Unexpected error during sign-in:', err);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal server error',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
