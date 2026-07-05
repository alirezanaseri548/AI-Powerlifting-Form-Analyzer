import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  };

  const jwtMock = {
    signAsync: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AuthService(prismaMock as any, jwtMock as unknown as JwtService);
  });

  it('should register a new user', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    prismaMock.user.create.mockResolvedValue({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    jwtMock.signAsync.mockResolvedValue('token');

    const result = await service.register({
      email: 'TEST@example.com',
      name: 'Test',
      password: 'password123'
    });

    expect(result.user.email).toBe('test@example.com');
    expect(result.accessToken).toBe('token');
  });

  it('should reject duplicate email during register', async () => {
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'existing-user'
    });

    await expect(
      service.register({
        email: 'test@example.com',
        password: 'password123'
      })
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should reject login if user does not exist', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'missing@example.com',
        password: 'password123'
      })
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
