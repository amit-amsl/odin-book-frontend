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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import {
  createPostInput,
  createPostInputSchema,
  useCreatePost,
} from '@/features/post/api/create-post';
import { DiamondMinus, EyeOff, Loader2 } from 'lucide-react';
import { TipTapRTEditor } from '@/components/tiptap/editor';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useParams } from 'react-router';

export function PostCreationRoute() {
  const params = useParams();
  const communityName = params.communityName as string;
  const navigate = useNavigate();

  const createPostForm = useForm<createPostInput>({
    resolver: zodResolver(createPostInputSchema),
    defaultValues: {
      title: '',
      content: '',
      isNSFW: false,
      isSpoiler: false,
    },
  });

  const createPostMutation = useCreatePost();

  function onSubmit(values: createPostInput) {
    console.log(values);
    createPostMutation.mutate(
      { communityName, data: values },
      {
        onSuccess: () => {
          createPostMutation.reset();
          navigate(`/c/${communityName}`);
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
          <CardTitle className="text-xl">Create post</CardTitle>
          <CardDescription>
            You are submitting a post. The key to a successful submission is
            interesting content and a descriptive title.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...createPostForm}>
            <form onSubmit={createPostForm.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <Separator />
                <div className="grid gap-6">
                  <FormField
                    control={createPostForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            disabled={createPostMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Label htmlFor="content">Content</Label>
                  <FormField
                    control={createPostForm.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="border-border bg-background gap-0 rounded-md border p-2 shadow-sm">
                        <FormControl className="">
                          <TipTapRTEditor
                            isContentEmptyHandler={undefined}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={createPostForm.control}
                  name="isSpoiler"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-4 rounded-md border p-4">
                      <FormLabel>
                        <EyeOff />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-none font-medium">
                            Mark post as Spoiler
                          </p>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          disabled={createPostMutation.isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={createPostForm.control}
                  name="isNSFW"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between space-x-4 rounded-md border p-4">
                      <FormLabel>
                        <DiamondMinus className="text-red-500" />
                        <div className="flex-1 space-y-1">
                          <p className="text-sm leading-none font-medium">
                            Mark post as NSFW (18+)
                          </p>
                        </div>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          disabled={createPostMutation.isPending}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={undefined} type="submit">
                  {createPostMutation.isPending ? (
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
