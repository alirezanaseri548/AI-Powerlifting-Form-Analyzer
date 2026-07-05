import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
    getMe: jest.fn()
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock
        }
      ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should call register service', async () => {
    authServiceMock.register.mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'token'
    });

    const result = await controller.register({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.accessToken).toBe('token');
    expect(authServiceMock.register).toHaveBeenCalledTimes(1);
  });

  it('should call login service', async () => {
    authServiceMock.login.mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'token'
    });

    const result = await controller.login({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(result.accessToken).toBe('token');
    expect(authServiceMock.login).toHaveBeenCalledTimes(1);
  });
});
