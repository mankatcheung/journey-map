import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.ts';
import type { IHashService } from '../../../domain/services/hash.service.interface.ts';
import type { ITokenService } from '../../../domain/services/token.service.interface.ts';
import type { PublicUser } from '../../../domain/entities/user.entity.ts';
import { EmailAlreadyExistsError } from '../../../domain/errors/index.ts';

type Input = { email: string; password: string; name: string };
type Output = { token: string; user: PublicUser };

export const signUpUseCase =
  (userRepo: IUserRepository, hashService: IHashService, tokenService: ITokenService) =>
  async (input: Input): Promise<Output> => {
    const existing = await userRepo.findByEmail(input.email);
    if (existing) throw new EmailAlreadyExistsError();

    const passwordHash = await hashService.hash(input.password);
    const user = await userRepo.create({ email: input.email, name: input.name, passwordHash });
    const token = await tokenService.sign({ userId: user.id, email: user.email });

    const { passwordHash: _, ...publicUser } = user;
    return { token, user: publicUser };
  };
