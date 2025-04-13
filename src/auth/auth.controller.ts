/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/dto/user.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() data: { email: string; password: string }) {
    return this.authService.signIn(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('user/signin')
  signUp(@Body() data: UserDTO) {
    console.log(data, 'user/signin');
    return this.authService.createUser(data);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('seller/signin')
  signUpBuyer(@Body() data: UserDTO) {
    console.log(data, 'user/seller');
    return this.authService.createSeller(data);
  }

  @UseGuards(AuthGuard)
  @Patch('logout')
  logout(@Request() req) {
    return this.authService.logoutUser(req.user);
  }
}
