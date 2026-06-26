import Elysia, { t } from 'elysia';
import type { AppContainer } from '../../container.ts';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
} from '../../domain/errors/index.ts';

export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .post(
    '/signup',
    async ({ container, body, set }: { container: AppContainer; body: { email: string; password: string; name: string }; set: { status: number } }) => {
      try {
        set.status = 201;
        return await container.useCases.signUp(body);
      } catch (err) {
        if (err instanceof EmailAlreadyExistsError) {
          set.status = 409;
          return { error: err.message };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 8 }),
        name: t.String({ minLength: 1 }),
      }),
    },
  )
  .post(
    '/signin',
    async ({ container, body, set }: { container: AppContainer; body: { email: string; password: string }; set: { status: number } }) => {
      try {
        return await container.useCases.signIn(body);
      } catch (err) {
        if (err instanceof InvalidCredentialsError) {
          set.status = 401;
          return { error: err.message };
        }
        throw err;
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
    },
  )
  .post('/logout', () => ({ message: 'Logged out' }));
