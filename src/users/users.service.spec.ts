import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from '@/users/dto/register.dto';
import { JwtService } from '@nestjs/jwt';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mockAccessToken'),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  it('定義されていること', () => {
    expect(service).toBeDefined();
  });

  describe('ユーザー登録', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password',
    };
    let hashedPassword: string;

    beforeEach(async () => {
      hashedPassword = await bcrypt.hash(registerDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(usersRepository, 'create').mockReturnValue({
        email: registerDto.email,
        hashedPassword: hashedPassword,
      } as User);
      jest.spyOn(usersRepository, 'save').mockResolvedValue({
        user_id: 1,
        email: registerDto.email,
        hashedPassword: hashedPassword,
      } as User);
    });

    it('パスワードがハッシュ化されること', async () => {
      await service.register(registerDto);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('ユーザーが登録されること', async () => {
      await service.register(registerDto);
      expect(usersRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        hashedPassword: hashedPassword,
      });
      expect(usersRepository.save).toHaveBeenCalled();
    });

    it('正しいユーザーオブジェクトが返されること', async () => {
      const user = await service.register(registerDto);
      expect(user).toEqual({
        user_id: 1,
        email: registerDto.email,
        hashedPassword: hashedPassword,
      });
    });
  });

  describe('ログイン', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password',
    };
    let user: User;

    beforeEach(() => {
      user = {
        user_id: 1,
        email: loginDto.email,
        hashedPassword: 'hashedPassword',
      } as User;

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    });

    it('ユーザーが見つかること', async () => {
      const result = await service.login(loginDto);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(result).toBeDefined();
    });

    it('パスワードが一致すること', async () => {
      await service.login(loginDto);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        user.hashedPassword,
      );
    });

    it('正しいトークンが返されること', async () => {
      const result = await service.login(loginDto);
      expect(jwtService.sign).toHaveBeenCalledWith({
        email: user.email,
        sub: user.user_id,
      });
      expect(result).toEqual({ accessToken: 'mockAccessToken' });
    });
  });
});
