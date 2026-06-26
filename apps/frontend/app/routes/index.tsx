import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuthStore } from '~/store/auth.store';

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState();
    if (token) {
      throw redirect({ to: '/map' });
    } else {
      throw redirect({ to: '/auth' });
    }
  },
  component: () => null,
});
