import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }
}
