import { AuthResponse, BaseResponse, JwtPayload } from '@/types/api';
import { api } from './api-client';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const USER_KEY = 'auth-user' as const;

export const loginInputSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Invalid email address format')
    .min(1, 'Field is required'),
  password: z.string().min(1, 'Field is required'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

async function login(data: LoginInput): Promise<AuthResponse> {
  return api.post('/auth/login', data);
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData([USER_KEY], user);
      toast.success('Logged in successfully!');
    },
  });
};

async function guestLogin(): Promise<AuthResponse> {
  return api.post('/auth/guest-login');
}

export const useGuestLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: guestLogin,
    onSuccess: (data) => {
      const { user } = data;
      queryClient.setQueryData([USER_KEY], user);
      toast.success('Guest user logged in successfully!');
    },
  });
};

export const registerInputSchema = z
  .object({
    email: z.string().trim().email('Invalid email address format'),
    username: z
      .string()
      .min(6, 'Username must be at least 6 characters long')
      .max(20, 'Username must not exceed 20 characters')
      .regex(
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, hyphens, and underscores'
      )
      .refine((value) => !/^\d+$/.test(value), {
        message: 'Username cannot be only numbers',
      }),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
      .regex(/[a-z]/, 'Password must include at least one lowercase letter')
      .regex(/[0-9]/, 'Password must include at least one number')
      .regex(
        /[@$!%*?&]/,
        'Password must include at least one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // path of error
  });

export type RegisterInput = z.infer<typeof registerInputSchema>;

async function register(data: RegisterInput): Promise<BaseResponse> {
  return api.post('/auth/register', data);
}

export const useRegister = () =>
  useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success('New account created successfully!');
    },
  });

async function logout(): Promise<void> {
  return api.post('/auth/logout');
}

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData([USER_KEY], null);
      queryClient.invalidateQueries({ queryKey: [USER_KEY] });
      toast.success('Logged out successfully!');
    },
  });
};

async function getUser(): Promise<JwtPayload> {
  return api.get('/auth/me');
}

export const useUser = () => {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [USER_KEY],
    queryFn: getUser,
    staleTime: 1000 * 60 * 60 * 3, // Keep data fresh for 3hours (don't refetch)
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    user,
    isLoading,
    isError,
    error,
    isAuthenticated: !!user,
  };
};
