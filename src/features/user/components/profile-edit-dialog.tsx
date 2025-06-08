import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import {
  editUserProfileInput,
  editUserProfileInputSchema,
  useEditUserProfile,
} from '../api/edit-user-profile';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { SpinnerLoadingCircle } from '@/components/spinner-loading-circle';
type ProfileEditDialogProps = {
  username: string;
  avatarUrl: string;
};

export function ProfileEditDialog({
  username,
  avatarUrl,
}: ProfileEditDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const editUserProfileForm = useForm<editUserProfileInput>({
    resolver: zodResolver(editUserProfileInputSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  const editUserProfileMutation = useEditUserProfile();

  function onSubmit(values: editUserProfileInput) {
    console.log(values);
    editUserProfileMutation.mutate(
      {
        username,
        data: values,
      },
      {
        onSuccess: () => {
          editUserProfileForm.reset();
          setIsDialogOpen(false);
          //navigate(`/c/${values.name}`);
        },
        // onError: (error: Error | AxiosError) => {
        //   if (axios.isAxiosError(error)) {
        //     console.log(error);
        //   }
        // },
      }
    );
  }

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) {
          editUserProfileForm.reset();
          setImagePreview(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="" variant={'outline'} size={'sm'}>
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...editUserProfileForm}>
          <form onSubmit={editUserProfileForm.handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <Avatar className="size-28">
                {editUserProfileMutation.isPending ? (
                  <div className="flex w-full items-center justify-center">
                    <SpinnerLoadingCircle />
                  </div>
                ) : (
                  <AvatarImage src={avatarUrl || imagePreview || undefined} />
                )}
                <AvatarFallback className="text-5xl">TD</AvatarFallback>
              </Avatar>
              <div className="grid gap-3">
                <FormField
                  control={editUserProfileForm.control}
                  name="avatar"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="file"
                          disabled={editUserProfileMutation.isPending}
                          value={undefined}
                          onChange={(event) => {
                            const avatarFile = event.target.files?.[0];
                            if (avatarFile) {
                              onChange(avatarFile);
                              setImagePreview(URL.createObjectURL(avatarFile));
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        <span>Supported Image formats: PNG/JPEG/JPG</span>
                        <span> Max Image size: 3MB</span>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="mt-3">
              <DialogClose asChild disabled={editUserProfileMutation.isPending}>
                <Button
                  disabled={editUserProfileMutation.isPending}
                  variant="outline"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                disabled={editUserProfileMutation.isPending}
                type="submit"
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
