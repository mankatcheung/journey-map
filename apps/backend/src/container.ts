import { createPrismaClient } from './infrastructure/database/prisma.client.ts';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository.ts';
import { PrismaJourneyRepository } from './infrastructure/repositories/prisma-journey.repository.ts';
import { PrismaLocationRepository } from './infrastructure/repositories/prisma-location.repository.ts';
import { PrismaRouteRepository } from './infrastructure/repositories/prisma-route.repository.ts';
import { JwtTokenService } from './infrastructure/services/jwt.token.service.ts';
import { BcryptHashService } from './infrastructure/services/bcrypt.hash.service.ts';
import { signUpUseCase } from './application/use-cases/auth/sign-up.use-case.ts';
import { signInUseCase } from './application/use-cases/auth/sign-in.use-case.ts';
import { getJourneysUseCase } from './application/use-cases/journeys/get-journeys.use-case.ts';
import { getJourneyUseCase } from './application/use-cases/journeys/get-journey.use-case.ts';
import { createJourneyUseCase } from './application/use-cases/journeys/create-journey.use-case.ts';
import { updateJourneyUseCase } from './application/use-cases/journeys/update-journey.use-case.ts';
import { deleteJourneyUseCase } from './application/use-cases/journeys/delete-journey.use-case.ts';
import { addLocationUseCase } from './application/use-cases/locations/add-location.use-case.ts';
import { updateLocationUseCase } from './application/use-cases/locations/update-location.use-case.ts';
import { removeLocationUseCase } from './application/use-cases/locations/remove-location.use-case.ts';
import { addRouteUseCase } from './application/use-cases/routes/add-route.use-case.ts';
import { removeRouteUseCase } from './application/use-cases/routes/remove-route.use-case.ts';

export function createContainer() {
  const prisma = createPrismaClient();

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) throw new Error('JWT_SECRET is not set');

  const tokenService = new JwtTokenService(jwtSecret, '7d');
  const hashService = new BcryptHashService();

  const userRepo = new PrismaUserRepository(prisma);
  const journeyRepo = new PrismaJourneyRepository(prisma);
  const locationRepo = new PrismaLocationRepository(prisma);
  const routeRepo = new PrismaRouteRepository(prisma);

  return {
    tokenService,
    useCases: {
      signUp: signUpUseCase(userRepo, hashService, tokenService),
      signIn: signInUseCase(userRepo, hashService, tokenService),
      getJourneys: getJourneysUseCase(journeyRepo),
      getJourney: getJourneyUseCase(journeyRepo),
      createJourney: createJourneyUseCase(journeyRepo),
      updateJourney: updateJourneyUseCase(journeyRepo),
      deleteJourney: deleteJourneyUseCase(journeyRepo),
      addLocation: addLocationUseCase(locationRepo, journeyRepo),
      updateLocation: updateLocationUseCase(locationRepo, journeyRepo),
      removeLocation: removeLocationUseCase(locationRepo, journeyRepo),
      addRoute: addRouteUseCase(routeRepo, locationRepo, journeyRepo),
      removeRoute: removeRouteUseCase(routeRepo, journeyRepo),
    },
  };
}

export type AppContainer = ReturnType<typeof createContainer>;
