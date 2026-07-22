import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface RegisterFormInputs {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin' | 'dealership_manager' | 'salesperson';
}

export const RegisterPage: React.FC = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues: {
      role: 'customer',
    },
  });

  const onSubmit = async (data: RegisterFormInputs) => {
    setApiError(null);
    setLoading(true);
    try {
      await registerAuth(data.name, data.email, data.password, data.role);
      navigate('/', { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please check your details and try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="text-slate-400 text-sm mt-2">Join DriveHub to buy, search, and manage vehicles</p>
        </div>

        {apiError && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-sm" role="alert">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className={`w-full bg-slate-950 border ${
                errors.name ? 'border-rose-500' : 'border-slate-800'
              } text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              placeholder="Jane Doe"
              {...register('name', {
                required: 'Full name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              })}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={`w-full bg-slate-950 border ${
                errors.email ? 'border-rose-500' : 'border-slate-800'
              } text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              placeholder="you@example.com"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address format',
                },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              className={`w-full bg-slate-950 border ${
                errors.password ? 'border-rose-500' : 'border-slate-800'
              } text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              placeholder="••••••••"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
            />
            {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
              Account Type
            </label>
            <select
              id="role"
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
              {...register('role')}
            >
              <option value="customer">Customer (Buy & Browse Vehicles)</option>
              <option value="admin">Dealership Admin (Full Management)</option>
              <option value="dealership_manager">Dealership Manager</option>
              <option value="salesperson">Salesperson</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
