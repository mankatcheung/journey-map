import Elysia from 'elysia';
import { UnauthorizedError } from '../../domain/errors/index.ts';
import type { AppContainer } from '../../container.ts';

export const authMiddleware = new Elysia({ name: 'auth-middleware' }).derive(
  { as: 'scoped' },
  // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
  async ({ container, headers }: { container: AppContainer; headers: Record<string, string | undefined> }) => {
    const authHeader = headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedError();

    const token = authHeader.slice(7);
    const payload = await container.tokenService.verify(token);
    if (!payload) throw new UnauthorizedError();

    return { currentUser: payload };
  },
);
