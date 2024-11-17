import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(signUpDto: RegisterDto): Promise<User> {
    const { email, password } = signUpDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      email,
      hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.hashedPassword))) {
      throw new UnauthorizedException(
        'メールアドレスかパスワードが間違っています。',
      );
    }

    return this.generateAccessToken(user);
  }

  private generateAccessToken(user: User) {
    const payload = { email: user.email, sub: user.user_id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
