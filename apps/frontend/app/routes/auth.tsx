import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { SignInForm } from '~/components/auth/SignInForm';
import { SignUpForm } from '~/components/auth/SignUpForm';
import { useAuthStore } from '~/store/auth.store';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => {
    const { token } = useAuthStore.getState();
    if (token) throw redirect({ to: '/map' });
  },
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white text-xl">
            🗺
          </div>
          <h1 className="text-xl font-bold text-gray-900">Journey Map</h1>
        </div>

        {mode === 'signin' ? (
          <SignInForm onSwitch={() => setMode('signup')} />
        ) : (
          <SignUpForm onSwitch={() => setMode('signin')} />
        )}
      </div>
    </div>
  );
}
