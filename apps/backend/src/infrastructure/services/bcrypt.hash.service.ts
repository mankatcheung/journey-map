import type { IHashService } from '../../domain/services/hash.service.interface.ts';

export class BcryptHashService implements IHashService {
  async hash(plain: string): Promise<string> {
    return Bun.password.hash(plain, { algorithm: 'bcrypt', cost: 12 });
  }

  async verify(plain: string, hashed: string): Promise<boolean> {
    return Bun.password.verify(plain, hashed);
  }
}
