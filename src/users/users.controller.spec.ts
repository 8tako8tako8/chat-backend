import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { RegisterDto } from '@/users/dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('定義されていること', () => {
    expect(controller).toBeDefined();
  });

  describe('ユーザー登録', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'password',
    };
    const result = {
      email: 'test@example.com',
      password: 'password123',
      id: 1,
      hashedPassword: 'hashedPassword123',
    };

    beforeEach(() => {
      jest.spyOn(service, 'register').mockResolvedValue(result);
    });

    it('UsersService.registerが正しいパラメータで呼び出されること', async () => {
      await controller.register(registerDto);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });

    it('正しいユーザーオブジェクトが返されること', async () => {
      const response = await controller.register(registerDto);
      expect(response).toEqual(result);
    });
  });

  describe('ログイン', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password',
    };

    beforeEach(() => {
      jest
        .spyOn(service, 'login')
        .mockResolvedValue({ accessToken: 'mockAccessToken' });
    });

    it('UsersService.loginが正しいパラメータで呼び出されること', async () => {
      await controller.login(loginDto);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });

    it('正しいトークンが返されること', async () => {
      const response = await controller.login(loginDto);
      expect(response).toEqual({ accessToken: 'mockAccessToken' });
    });
  });
});
