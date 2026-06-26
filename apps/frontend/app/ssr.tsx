import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/react-start/server';
import { getRouter } from './router';

// @ts-expect-error: createStartHandler type definitions in TanStack Start v1.168.x have type mismatches
export default createStartHandler({ createRouter: getRouter })(defaultStreamHandler);
