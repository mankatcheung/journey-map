import type { IUserRepository } from '../../../domain/repositories/user.repository.interface.ts';
import type { IHashService } from '../../../domain/services/hash.service.interface.ts';
import type { ITokenService } from '../../../domain/services/token.service.interface.ts';
import type { PublicUser } from '../../../domain/entities/user.entity.ts';
import { InvalidCredentialsError } from '../../../domain/errors/index.ts';

type Input = { email: string; password: string };
type Output = { token: string; user: PublicUser };

export const signInUseCase =
  (userRepo: IUserRepository, hashService: IHashService, tokenService: ITokenService) =>
  async (input: Input): Promise<Output> => {
    const user = await userRepo.findByEmail(input.email);
    if (!user) throw new InvalidCredentialsError();

    const valid = await hashService.verify(input.password, user.passwordHash);
    if (!valid) throw new InvalidCredentialsError();

    const token = await tokenService.sign({ userId: user.id, email: user.email });
    const { passwordHash: _, ...publicUser } = user;
    return { token, user: publicUser };
  };
