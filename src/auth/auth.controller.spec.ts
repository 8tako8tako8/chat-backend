import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { SignUpDto } from '@/auth/dto/signup.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('定義されていること', () => {
    expect(controller).toBeDefined();
  });

  describe('ユーザー登録', () => {
    const signUpDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password',
      name: 'Test User',
    };
    const result = { id: 1, ...signUpDto };

    beforeEach(() => {
      jest.spyOn(service, 'signUp').mockResolvedValue(result);
    });

    it('AuthService.signUpが正しいパラメータで呼び出されること', async () => {
      await controller.signUp(signUpDto);
      expect(service.signUp).toHaveBeenCalledWith(signUpDto);
    });

    it('正しいユーザーオブジェクトが返されること', async () => {
      const response = await controller.signUp(signUpDto);
      expect(response).toEqual(result);
    });
  });
});
