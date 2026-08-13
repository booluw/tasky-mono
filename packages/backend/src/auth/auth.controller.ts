import { Controller, Post, Body } from '@nestjs/common';

import { Public } from 'decorators/public.decorator';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  create(@Body() data: AuthLoginDto) {
    return this.authService.logUserIn(data);
  }

  @Public()
  @Post('/check-email')
  checkEmail(@Body() email: string) {
    return this.authService.checkEmail(email);
  }

  @Post('/set-password')
  setPassword(@Body() data: AuthLoginDto) {
    return this.authService.setPassword(data);
  }

  @Post('/reset-password')
  resetPassword(@Body() email: string) {
    return this.authService.resetPassword(email);
  }
}
