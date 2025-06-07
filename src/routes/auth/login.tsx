import { zodResolver } from '@hookform/resolvers/zod';
import { LoginInput, loginInputSchema, useLogin } from '@/lib/auth';
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

export default function LoginRoute() {
  const [serverError, setServerError] = useState('');
  const login = useLogin();

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginInputSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LoginInput) {
    login.mutate(values, {
      onSuccess() {
        loginForm.reset();
      },
      onError(error: Error | AxiosError) {
        if (axios.isAxiosError(error)) {
          setServerError(error.response?.data.message);
          loginForm.resetField('password');
        }
      },
    });
  }

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <ModeToggle toggleLocation="beforeAuth" />
      <div className="w-full max-w-sm">
        <Form {...loginForm}>
          <form onSubmit={loginForm.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Bot className="size-6" />
                </div>
                <span className="sr-only">Tidder</span>
                <h1 className="text-xl font-bold">Welcome to Tidder</h1>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{' '}
                  <Link
                    to={'/register'}
                    className="underline underline-offset-4"
                  >
                    Sign up
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="m@example.com"
                          disabled={login.isPending}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          disabled={login.isPending}
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={login.isPending} type="submit">
                  {login.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Login'
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
          {/* <AlertDescription>
          Your session has expired. Please log in again.
        </AlertDescription> */}
        </Alert>
      )}
      <div className="text-muted-foreground hover:[&_a]:text-primary text-center text-xs text-balance [&_a]:underline [&_a]:underline-offset-4">
        By clicking login, you agree to our <a href="#">Terms of Service</a> and{' '}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
