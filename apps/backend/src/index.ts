import Elysia from 'elysia';
import cors from '@elysiajs/cors';
import { createContainer } from './container.ts';
import { authRoutes } from './presentation/routes/auth.routes.ts';
import { journeyRoutes } from './presentation/routes/journeys.routes.ts';
import { locationRoutes } from './presentation/routes/locations.routes.ts';
import { routeRoutes } from './presentation/routes/routes.routes.ts';
import {
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  ConflictError,
  ValidationError,
  InvalidCredentialsError,
  EmailAlreadyExistsError,
} from './domain/errors/index.ts';

const container = createContainer();
const port = Number(process.env.PORT ?? 3001);

const app = new Elysia()
  .use(
    cors({
      origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
      credentials: true,
    }),
  )
  .decorate('container', container)
  .onError(({ error, set }) => {
    if (error instanceof UnauthorizedError) {
      set.status = 401;
      return { error: error.message };
    }
    if (error instanceof ForbiddenError) {
      set.status = 403;
      return { error: error.message };
    }
    if (error instanceof NotFoundError) {
      set.status = 404;
      return { error: error.message };
    }
    if (error instanceof ConflictError || error instanceof EmailAlreadyExistsError) {
      set.status = 409;
      return { error: error.message };
    }
    if (error instanceof ValidationError) {
      set.status = 422;
      return { error: error.message };
    }
    if (error instanceof InvalidCredentialsError) {
      set.status = 401;
      return { error: error.message };
    }
    console.error('Unhandled error:', error);
    set.status = 500;
    return { error: 'Internal server error' };
  })
  .use(authRoutes)
  .use(journeyRoutes)
  .use(locationRoutes)
  .use(routeRoutes)
  .get('/health', () => ({ status: 'ok' }))
  .listen(port);

console.log(`Server running at http://localhost:${port}`);
