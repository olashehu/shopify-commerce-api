import { Controller, Post } from '@nestjs/common';
// import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('/v1')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  createUser() {}
}
