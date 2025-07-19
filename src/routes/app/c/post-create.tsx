import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import * as RadioGroup from '@radix-ui/react-radio-group';
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
import {
  createPostInput,
  createPostInputSchema,
  useCreatePost,
} from '@/features/post/api/create-post';
import { DiamondMinus, EyeOff, Loader2, X } from 'lucide-react';
import { TipTapRTEditor } from '@/components/tiptap/editor';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useNavigate, useParams } from 'react-router';
import { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import ReactPlayer from 'react-player';

const postTypeOptions = [
  {
    value: 'text',
    label: 'Text only',
  },
  {
    value: 'image',
    label: 'Image',
  },
  {
    value: 'youtube',
    label: 'Youtube video',
  },
];

export default function PostCreationRoute() {
  const [postType, setPostType] = useState<'text' | 'image' | 'youtube'>(
    'text'
  );
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const params = useParams();
  const communityName = params.communityName as string;
  const navigate = useNavigate();

  const createPostForm = useForm<createPostInput>({
    resolver: zodResolver(createPostInputSchema(postType)),
    defaultValues: {
      title: '',
      content: '',
      isNSFW: false,
      isSpoiler: false,
    },
  });

  const formYoutubeURL = createPostForm.watch('youtubeUrl');

  const createPostMutation = useCreatePost();

  function onSubmit(values: createPostInput) {
    createPostMutation.mutate(
      { communityName, data: values },
      {
        onSuccess: (data) => {
          const { postId } = data;
          createPostMutation.reset();
          navigate(`/c/${communityName}/${postId}`);
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
      <Card className="max-w-sm grow md:max-w-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="default">c/{communityName}</Badge>
            <CardTitle className="text-xl">Create post</CardTitle>
          </div>
          <CardDescription>
            You are submitting a post. The key to a successful submission is
            interesting content and a descriptive title.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          <RadioGroup.Root
            value={postType}
            disabled={createPostMutation.isPending}
            onValueChange={(value: 'text' | 'image' | 'youtube') => {
              setPostType(value);
              setCurrentFile(null);
              setImagePreview(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              createPostForm.resetField('image');
              createPostForm.resetField('youtubeUrl');
            }}
            defaultValue={postTypeOptions[0].value}
            className="mb-3 grid w-full max-w-sm grid-cols-3 gap-3 self-center"
          >
            {postTypeOptions.map((option) => (
              <RadioGroup.Item
                key={option.value}
                value={option.value}
                className="ring-border rounded px-2 py-1 ring-[1px] data-[state=checked]:ring-2 data-[state=checked]:ring-blue-500"
              >
                <span className="font-semibold tracking-tight">
                  {option.label}
                </span>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <Form {...createPostForm}>
            <form onSubmit={createPostForm.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
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
                {postType === 'image' && (
                  <FormField
                    control={createPostForm.control}
                    name="image"
                    render={({ field: { onChange, ...field } }) => (
                      <FormItem>
                        {postType === 'image' && imagePreview && (
                          <div className="relative inline-block">
                            <img
                              src={imagePreview}
                              alt="post image preview"
                              className="max-h-72 w-full rounded-lg object-contain"
                            />
                            <Button
                              type="button"
                              size={'icon'}
                              disabled={createPostMutation.isPending}
                              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                              onClick={() => {
                                onChange(null);
                                setCurrentFile(null);
                                setImagePreview(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        )}
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            ref={fileInputRef}
                            type="file"
                            disabled={createPostMutation.isPending}
                            value={undefined}
                            accept="image/png, image/jpg, image/jpeg"
                            onChange={(e) => {
                              const imageFile = e.target.files?.[0];
                              if (imageFile) {
                                onChange(imageFile);
                                setCurrentFile(imageFile);
                                setImagePreview(URL.createObjectURL(imageFile));
                              } else {
                                if (currentFile && fileInputRef.current) {
                                  const dt = new DataTransfer();
                                  dt.items.add(currentFile);
                                  fileInputRef.current.files = dt.files;
                                }
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription className="flex flex-col gap-2">
                          <span>Supported Image formats: PNG/JPEG/JPG</span>
                          <span>Max Image size: 5MB</span>
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {postType === 'youtube' && (
                  <FormField
                    control={createPostForm.control}
                    name="youtubeUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Youtube URL</FormLabel>
                        <FormControl>
                          <Input
                            disabled={createPostMutation.isPending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <p className="text-sm leading-none font-medium select-none">
                          Video preview
                        </p>
                        <ReactPlayer
                          src={formYoutubeURL}
                          style={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16/9',
                          }}
                          controls
                        />
                      </FormItem>
                    )}
                  />
                )}
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
