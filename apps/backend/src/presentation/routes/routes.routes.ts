import Elysia, { t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import type { AppContainer } from '../../container.ts';
import type { TokenPayload } from '../../domain/services/token.service.interface.ts';

type Ctx = { container: AppContainer; currentUser: TokenPayload; params: { journeyId: string }; set: { status: number } };

export const routeRoutes = new Elysia({ prefix: '/api/journeys/:journeyId/routes' })
  .use(authMiddleware)
  .post(
    '/',
    // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
    async ({ container, currentUser, params, body, set }: Ctx & { body: Record<string, unknown> }) => {
      try {
        set.status = 201;
        return {
          route: await container.useCases.addRoute({
            journeyId: params.journeyId,
            userId: currentUser.userId,
            ...(body as any),
          }),
        };
      } catch (err: unknown) {
        const e = err as Error;
        if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
        if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
        if (e.name === 'ConflictError') { set.status = 409; return { error: e.message }; }
        if (e.name === 'ValidationError') { set.status = 422; return { error: e.message }; }
        throw err;
      }
    },
    {
      body: t.Object({
        fromLocationId: t.String(),
        toLocationId: t.String(),
        notes: t.Optional(t.String()),
      }),
    },
  )
  // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
  .delete('/:routeId', async ({ container, currentUser, params, set }: Ctx & { params: { journeyId: string; routeId: string } }) => {
    try {
      await container.useCases.removeRoute({
        id: (params as { routeId: string }).routeId,
        journeyId: params.journeyId,
        userId: currentUser.userId,
      });
      set.status = 204;
      return null;
    } catch (err: unknown) {
      const e = err as Error;
      if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
      if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
      throw err;
    }
  });
