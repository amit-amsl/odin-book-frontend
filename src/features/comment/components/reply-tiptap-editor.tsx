import { TipTapRTEditor } from '@/components/tiptap/editor';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useCreateCommentReply } from '../api/create-comment-reply';
import {
  createCommentInput,
  createCommentInputSchema,
} from '../api/create-comment';
import axios, { AxiosError } from 'axios';

type ReplyRTEditorProps = {
  communityName: string;
  postId: string;
  commentId: string;
  handleVisibility: (value: boolean) => void;
};

export function ReplyRTEditor({
  communityName,
  postId,
  commentId,
  handleVisibility,
}: ReplyRTEditorProps) {
  const [isContentEmpty, setIsContentEmpty] = useState(false);

  const createCommentReplyMutation = useCreateCommentReply();

  const createCommentReplyForm = useForm<createCommentInput>({
    resolver: zodResolver(createCommentInputSchema),
  });

  function onSubmit(values: createCommentInput) {
    console.log(values);
    createCommentReplyMutation.mutate(
      { communityName, postId, commentId, data: values },
      {
        onSuccess: () => {
          createCommentReplyForm.reset({ content: '' });
          handleVisibility(false);
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
    <div className="border-border bg-background rounded-md border p-2 shadow-sm">
      <Form {...createCommentReplyForm}>
        <form onSubmit={createCommentReplyForm.handleSubmit(onSubmit)}>
          <FormField
            control={createCommentReplyForm.control}
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
            <Button
              type="button"
              variant="outline"
              onClick={() => handleVisibility(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isContentEmpty}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
