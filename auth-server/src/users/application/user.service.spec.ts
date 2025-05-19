import { UsersService } from './users.service';
import { UserRepository } from '../domain/user.repository';
import { User, UserRole } from '../domain/user.schema';
import { UserCreateInput } from './dto/user-create.input';
import { UpdateRoleInput } from './dto/update-role.input';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepository = {
      findByMapleId: jest.fn(),
      save: jest.fn(),
      deleteByMapleId: jest.fn(),
    };
    service = new UsersService(userRepository);
  });

  describe('register', () => {
    it('새로운 유저를 성공적으로 등록한다', async () => {
      userRepository.findByMapleId.mockResolvedValue(null);
      userRepository.save.mockImplementation(async (user) => user);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_pw' as never);

      const input = new UserCreateInput({
        nexonId: 'test@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'pw1234',
      });

      const result = await service.register(input);
      expect(result.nexonId).toBe('test@nexon.com');
      expect(result.mapleId).toBe('testuser');
      expect(result.secondPassword).toBe('hashed_pw');
      expect(result.role).toBe(UserRole.USER);
    });

    it('이미 존재하는 mapleId로 등록 시 에러를 발생시킨다', async () => {
      userRepository.findByMapleId.mockResolvedValue(new User({
        nexonId: 'exist@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'hashed_pw',
      }));
      const input = new UserCreateInput({
        nexonId: 'test@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'pw1234',
      });
      await expect(service.register(input)).rejects.toThrow('이미 사용 중인 메이플ID입니다.');
    });
  });

  describe('updateRole', () => {
    it('존재하는 유저의 역할을 성공적으로 변경한다', async () => {
      const user = new User({
        nexonId: 'test@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'hashed_pw',
        role: UserRole.USER,
      });
      userRepository.findByMapleId.mockResolvedValue(user);
      userRepository.save.mockImplementation(async (u) => u);

      const input = new UpdateRoleInput({ mapleId: 'testuser', role: UserRole.ADMIN });
      const result = await service.updateRole(input);
      expect(result.role).toBe(UserRole.ADMIN);
    });

    it('존재하지 않는 유저의 역할 변경 시 에러를 발생시킨다', async () => {
      userRepository.findByMapleId.mockResolvedValue(null);
      const input = new UpdateRoleInput({ mapleId: 'notfound', role: UserRole.ADMIN });
      await expect(service.updateRole(input)).rejects.toThrow('유저를 찾을 수 없습니다.');
    });
  });

  describe('changePassword', () => {
    it('기존 비밀번호가 맞으면 새 비밀번호로 성공적으로 변경한다', async () => {
      const user = new User({
        nexonId: 'test@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'hashed_old',
        role: UserRole.USER,
      });
      userRepository.findByMapleId.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_new' as never);
      userRepository.save.mockImplementation(async (u) => u);

      const input = { mapleId: 'testuser', oldPassword: 'oldpw', newPassword: 'newpw123' };
      const result = await service.changePassword(input);
      expect(result.secondPassword).toBe('hashed_new');
    });

    it('기존 비밀번호가 일치하지 않으면 에러를 발생시킨다', async () => {
      const user = new User({
        nexonId: 'test@nexon.com',
        mapleId: 'testuser',
        secondPassword: 'hashed_old',
        role: UserRole.USER,
      });
      userRepository.findByMapleId.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
      const input = { mapleId: 'testuser', oldPassword: 'wrongpw', newPassword: 'newpw123' };
      await expect(service.changePassword(input)).rejects.toThrow('기존 비밀번호가 일치하지 않습니다.');
    });

    it('존재하지 않는 유저의 비밀번호 변경 시 에러를 발생시킨다', async () => {
      userRepository.findByMapleId.mockResolvedValue(null);
      const input = { mapleId: 'notfound', oldPassword: 'oldpw', newPassword: 'newpw123' };
      await expect(service.changePassword(input)).rejects.toThrow('유저를 찾을 수 없습니다.');
    });
  });

  describe('deleteUser', () => {
    it('비밀번호가 맞으면 유저를 성공적으로 삭제한다', async () => {
      const user = new User({ nexonId: 'test@nexon.com', mapleId: 'testuser', secondPassword: 'hashed_pw', role: UserRole.USER });
      userRepository.findByMapleId.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      userRepository.deleteByMapleId = jest.fn().mockResolvedValue(undefined);

      const input = { mapleId: 'testuser', password: 'pw1234' };
      await expect(service.deleteUser(input)).resolves.toBeUndefined();
      expect(userRepository.deleteByMapleId).toBeCalledWith('testuser');
    });

    it('비밀번호가 틀리면 에러를 발생시킨다', async () => {
      const user = new User({ nexonId: 'test@nexon.com', mapleId: 'testuser', secondPassword: 'hashed_pw', role: UserRole.USER });
      userRepository.findByMapleId.mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const input = { mapleId: 'testuser', password: 'wrongpw' };
      await expect(service.deleteUser(input)).rejects.toThrow('비밀번호가 일치하지 않습니다.');
    });

    it('존재하지 않는 유저 삭제 시 에러를 발생시킨다', async () => {
      userRepository.findByMapleId.mockResolvedValue(null);

      const input = { mapleId: 'notfound', password: 'pw1234' };
      await expect(service.deleteUser(input)).rejects.toThrow('유저를 찾을 수 없습니다.');
    });
  });
});
