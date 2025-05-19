import { User } from './user.schema';

export interface UserRepository {
  findByMapleId(mapleId: string): Promise<User | null>;
  save(user: User): Promise<User>;
  deleteByMapleId(mapleId: string): Promise<void>;
} 