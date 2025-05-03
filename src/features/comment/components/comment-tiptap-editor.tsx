import { useState } from 'react';
import { TipTapRTEditor } from '@/components/tiptap/editor';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import {
  createCommentInput,
  createCommentInputSchema,
  useCreateComment,
} from '../api/create-comment';
import axios, { AxiosError } from 'axios';

type CommentRTEditorProps = {
  communityName: string;
  postId: string;
};

export function CommentRTEditor({
  communityName,
  postId,
}: CommentRTEditorProps) {
  const [collapsed, setCollapsed] = useState(true);
  const [isContentEmpty, setIsContentEmpty] = useState(false);

  const createCommentMutation = useCreateComment();

  const createCommentForm = useForm<createCommentInput>({
    resolver: zodResolver(createCommentInputSchema),
  });

  function onSubmit(values: createCommentInput) {
    console.log(values);
    createCommentMutation.mutate(
      { communityName, postId, data: values },
      {
        onSuccess: () => {
          createCommentForm.reset({ content: '' });
          setCollapsed(true);
        },
        onError: (error: Error | AxiosError) => {
          if (axios.isAxiosError(error)) {
            console.log(error);
          }
        },
      }
    );
  }

  const handleCancel = () => {
    setCollapsed(true);
  };

  const handleFocus = () => {
    setCollapsed(false);
  };

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        collapsed ? 'h-auto overflow-hidden' : 'h-auto'
      }`}
    >
      <div className="border-border bg-background rounded-md border p-2 shadow-sm">
        {collapsed ? (
          <>
            <input
              type="text"
              defaultValue={'Join the conversation...'}
              className="text-muted-foreground w-full bg-transparent text-sm outline-none"
              onFocus={handleFocus}
              readOnly
            />
          </>
        ) : (
          <>
            <Form {...createCommentForm}>
              <form onSubmit={createCommentForm.handleSubmit(onSubmit)}>
                <FormField
                  control={createCommentForm.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="gap-0">
                      <FormControl>
                        <TipTapRTEditor
                          isContentEmptyHandler={setIsContentEmpty}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button disabled={isContentEmpty} type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}
