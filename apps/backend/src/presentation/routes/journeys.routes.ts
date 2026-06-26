import Elysia, { t } from 'elysia';
import { authMiddleware } from '../middleware/auth.middleware.ts';
import type { AppContainer } from '../../container.ts';
import type { TokenPayload } from '../../domain/services/token.service.interface.ts';

type JourneyCtx = { container: AppContainer; currentUser: TokenPayload };
type JourneyParamCtx = JourneyCtx & { params: { journeyId: string }; set: { status: number } };

export const journeyRoutes = new Elysia({ prefix: '/api/journeys' })
  .use(authMiddleware)
  .get('/', async ({ container, currentUser }: JourneyCtx) => {
    return { journeys: await container.useCases.getJourneys({ userId: currentUser.userId }) };
  })
  .post(
    '/',
    async ({ container, currentUser, body, set }: JourneyCtx & { body: Record<string, unknown>; set: { status: number } }) => {
      set.status = 201;
      return { journey: await container.useCases.createJourney({ userId: currentUser.userId, ...(body as object) }) };
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        description: t.Optional(t.String()),
        startDate: t.Optional(t.String()),
        endDate: t.Optional(t.String()),
      }),
    },
  )
  .get('/:journeyId', async ({ container, currentUser, params, set }: JourneyParamCtx) => {
    try {
      return { journey: await container.useCases.getJourney({ id: params.journeyId, userId: currentUser.userId }) };
    } catch (err: unknown) {
      const e = err as Error;
      if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
      if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
      throw err;
    }
  })
  .put(
    '/:journeyId',
    async ({ container, currentUser, params, body, set }: JourneyParamCtx & { body: Record<string, unknown> }) => {
      try {
        return { journey: await container.useCases.updateJourney({ id: params.journeyId, userId: currentUser.userId, ...(body as object) }) };
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
        description: t.Optional(t.Nullable(t.String())),
        startDate: t.Optional(t.Nullable(t.String())),
        endDate: t.Optional(t.Nullable(t.String())),
      }),
    },
  )
  .delete('/:journeyId', async ({ container, currentUser, params, set }: JourneyParamCtx) => {
    try {
      await container.useCases.deleteJourney({ id: params.journeyId, userId: currentUser.userId });
      set.status = 204;
      return null;
    } catch (err: unknown) {
      const e = err as Error;
      if (e.name === 'NotFoundError') { set.status = 404; return { error: e.message }; }
      if (e.name === 'ForbiddenError') { set.status = 403; return { error: e.message }; }
      throw err;
    }
  });
