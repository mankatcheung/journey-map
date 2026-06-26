import { hydrateRoot } from 'react-dom/client';
import { StartClient } from '@tanstack/react-start/client';
import { getRouter } from './router';

const router = getRouter();
// @ts-expect-error: StartClient in TanStack Start v1.168.x doesn't declare router prop in its types
hydrateRoot(document, <StartClient router={router} />);
