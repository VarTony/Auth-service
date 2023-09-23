import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../service/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [ AuthService ]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be return jwt pair', () => {
    expect(controller).toBeDefined();
  });
});
