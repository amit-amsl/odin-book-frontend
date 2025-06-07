import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import {
  createCommunityInput,
  createCommunityInputSchema,
  useCreateCommunity,
} from '@/features/community/api/create-community';
import { Textarea } from '@/components/ui/textarea';

export default function CommunityCreationRoute() {
  const navigate = useNavigate();

  const createCommunityForm = useForm<createCommunityInput>({
    resolver: zodResolver(createCommunityInputSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const createCommunityMutation = useCreateCommunity();

  function onSubmit(values: createCommunityInput) {
    console.log(values);
    createCommunityMutation.mutate(
      { data: values },
      {
        onSuccess: () => {
          createCommunityForm.reset();
          navigate(`/c/${values.name}`);
        },
        onError: (error: Error | AxiosError) => {
          if (axios.isAxiosError(error)) {
            console.log(error);
          }
        },
      }
    );
  }

  return (
    <div className="bg-muted flex min-h-full w-full items-center justify-center p-4">
      <Card className="max-w-sm grow md:max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create community</CardTitle>
          <CardDescription>
            You are creating a community. name and description help people
            understand what your community is all about
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...createCommunityForm}>
            <form onSubmit={createCommunityForm.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <Separator />
                <div className="grid gap-6">
                  <FormField
                    control={createCommunityForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={createCommunityMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          no spaces, e.g., "books" or "bookclub". avoid using
                          solely trademarked names, e.g. use "FansOfAcme"
                          instead of "Acme". once chosen, this name cannot be
                          changed.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createCommunityForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us a little bit about your community"
                            className="resize-none"
                            disabled={createCommunityMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button disabled={undefined} type="submit">
                  {createCommunityMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Please wait
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
                <div className="text-muted-foreground text-center text-sm">
                  please be mindful of tidder's content policy and practice good
                  tiddequette.
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
