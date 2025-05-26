import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDTO, LoginDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signup(@Body() createDto: UserDTO) {
    return this.authService.createUser(createDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.signIn(loginDto);
  }
}
