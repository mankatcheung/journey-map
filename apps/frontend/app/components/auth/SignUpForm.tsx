import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authService } from '~/services/auth.service';
import { useAuthStore } from '~/store/auth.store';
import { useRouter } from '@tanstack/react-router';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSwitch: () => void;
}

export function SignUpForm({ onSwitch }: Props) {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authService.signUp(data.email, data.password, data.name);
      setAuth(result.token, result.user);
      router.navigate({ to: '/map' });
    } catch (err) {
      setError('root', { message: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>

      {errors.root && (
        <p className="rounded bg-red-50 p-3 text-sm text-red-600">{errors.root.message}</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="Your name"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          {...register('password')}
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? 'Creating account…' : 'Sign Up'}
      </button>

      <p className="text-center text-sm text-gray-600">
        Have an account?{' '}
        <button type="button" onClick={onSwitch} className="text-blue-600 hover:underline">
          Sign in
        </button>
      </p>
    </form>
  );
}
