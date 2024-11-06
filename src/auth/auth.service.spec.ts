import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '@/auth/auth.service';
import { PrismaService } from '@/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from '@/auth/dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('定義されていること', () => {
    expect(service).toBeDefined();
  });

  describe('ユーザー登録', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
    };
    let hashedPassword: string;

    beforeEach(async () => {
      hashedPassword = await bcrypt.hash(signUpDto.password, 10);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 1,
        email: signUpDto.email,
        password: hashedPassword,
        name: signUpDto.name,
      });
    });

    it('パスワードがハッシュ化されること', async () => {
      await service.signUp(signUpDto);
      expect(bcrypt.hash).toHaveBeenCalledWith(signUpDto.password, 10);
    });

    it('ユーザーがデータベースに作成されること', async () => {
      await service.signUp(signUpDto);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: signUpDto.email,
          password: hashedPassword,
          name: signUpDto.name,
        },
      });
    });

    it('正しいユーザーオブジェクトが返されること', async () => {
      const user = await service.signUp(signUpDto);
      expect(user).toEqual({
        id: 1,
        email: signUpDto.email,
        password: hashedPassword,
        name: signUpDto.name,
      });
    });
  });
});
