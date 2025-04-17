import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  //   UseGuards,
  //   Request,
  //   Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO } from 'src/user/user.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('signin')
  signup(@Body() createDto: UserDTO) {
    return this.authService.createUser(createDto);
  }

  @Post('login')
  login(@Body() loginDto: { email: string; password: string }) {
    return this.authService.signIn(loginDto);
  }

  //   @Patch('logout')
}
