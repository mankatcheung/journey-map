import Elysia, { t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import type { AppContainer } from '../../container.ts';
import type { TokenPayload } from '../../domain/services/token.service.interface.ts';

type Ctx = { container: AppContainer; currentUser: TokenPayload; params: { journeyId: string }; set: { status: number } };

export const locationRoutes = new Elysia({ prefix: '/api/journeys/:journeyId/locations' })
  .use(authMiddleware)
  .post(
    '/',
    // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
    async ({ container, currentUser, params, body, set }: Ctx & { body: Record<string, unknown> }) => {
      try {
        set.status = 201;
        return {
          location: await container.useCases.addLocation({
            journeyId: params.journeyId,
            userId: currentUser.userId,
            ...(body as any),
          }),
        };
      } catch (err: unknown) {
        const e = err as Error;
        if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
        if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
        throw err;
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        latitude: t.Number({ minimum: -90, maximum: 90 }),
        longitude: t.Number({ minimum: -180, maximum: 180 }),
        date: t.String(),
        address: t.Optional(t.String()),
        notes: t.Optional(t.String()),
      }),
    },
  )
  .put(
    '/:locId',
    // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
    async ({ container, currentUser, params, body, set }: Ctx & { params: { journeyId: string; locId: string }; body: Record<string, unknown> }) => {
      try {
        return {
          location: await container.useCases.updateLocation({
            id: (params as { locId: string }).locId,
            journeyId: params.journeyId,
            userId: currentUser.userId,
            ...(body as object),
          }),
        };
      } catch (err: unknown) {
        const e = err as Error;
        if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
        if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
        throw err;
      }
    },
    {
      body: t.Object({
        name: t.Optional(t.String({ minLength: 1 })),
        latitude: t.Optional(t.Number({ minimum: -90, maximum: 90 })),
        longitude: t.Optional(t.Number({ minimum: -180, maximum: 180 })),
        date: t.Optional(t.String()),
        address: t.Optional(t.Nullable(t.String())),
        notes: t.Optional(t.Nullable(t.String())),
        order: t.Optional(t.Number({ minimum: 1 })),
      }),
    },
  )
  // @ts-expect-error: container is provided at runtime via parent app's .decorate('container', container)
  .delete('/:locId', async ({ container, currentUser, params, set }: Ctx & { params: { journeyId: string; locId: string } }) => {
    try {
      await container.useCases.removeLocation({
        id: (params as { locId: string }).locId,
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
