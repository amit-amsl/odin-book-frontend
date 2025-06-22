import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterInput, registerInputSchema, useRegister } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bot, Loader2 } from 'lucide-react';
import { Link } from 'react-router';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { ModeToggle } from '@/components/mode-toggle';

export default function RegisterRoute() {
  const [serverError, setServerError] = useState('');
  const register = useRegister();

  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(registerInputSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: RegisterInput) {
    register.mutate(values, {
      onSuccess() {
        registerForm.reset();
      },
      onError: (error: Error | AxiosError) => {
        if (axios.isAxiosError(error)) {
          setServerError(error.response?.data.message);
          registerForm.resetField('password');
          registerForm.resetField('confirmPassword');
        }
      },
    });
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ModeToggle toggleLocation="beforeAuth" />
      <div className="w-full max-w-sm">
        <Form {...registerForm}>
          <form onSubmit={registerForm.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Bot className="size-6" />
                </div>
                <span className="sr-only">Tidder</span>
                <h1 className="text-xl font-bold">Join our community</h1>
                <div className="text-center text-sm">
                  Already have an account?{' '}
                  <Link to={'/login'} className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          disabled={register.isPending}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="tidderLover12"
                          disabled={register.isPending}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          disabled={register.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          disabled={register.isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={register.isPending} type="submit">
                  {register.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Create an account'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
      {serverError && (
        <Alert variant="destructive" className="max-w-sm">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="line-clamp-none">{serverError}</AlertTitle>
        </Alert>
      )}
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking create, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
