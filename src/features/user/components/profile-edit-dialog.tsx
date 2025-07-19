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
import { useRef, useState } from 'react';
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
import { X } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const editUserProfileForm = useForm<editUserProfileInput>({
    resolver: zodResolver(editUserProfileInputSchema),
    defaultValues: {
      avatar: undefined,
    },
  });

  const editUserProfileMutation = useEditUserProfile();

  function onSubmit(values: editUserProfileInput) {
    editUserProfileMutation.mutate(
      {
        username,
        data: values,
      },
      {
        onSuccess: () => {
          editUserProfileForm.reset();
          setIsDialogOpen(false);
        },
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
              <div className="grid gap-3">
                <FormField
                  control={editUserProfileForm.control}
                  name="avatar"
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <div className="flex flex-col items-center justify-center gap-3">
                        <Avatar className="size-28">
                          {editUserProfileMutation.isPending ? (
                            <div className="flex w-full items-center justify-center">
                              <SpinnerLoadingCircle />
                            </div>
                          ) : (
                            <AvatarImage
                              src={imagePreview || avatarUrl || undefined}
                            />
                          )}
                          <AvatarFallback className="text-5xl">
                            {username.toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        {imagePreview && (
                          <Button
                            type="button"
                            size={'sm'}
                            className="bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
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
                            Remove selection
                          </Button>
                        )}
                      </div>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          ref={fileInputRef}
                          type="file"
                          disabled={editUserProfileMutation.isPending}
                          accept="image/png, image/jpg, image/jpeg"
                          value={undefined}
                          onChange={(e) => {
                            const avatarFile = e.target.files?.[0];
                            if (avatarFile) {
                              onChange(avatarFile);
                              setCurrentFile(avatarFile);
                              setImagePreview(URL.createObjectURL(avatarFile));
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
                        <span>* Supported Image formats: PNG/JPEG/JPG</span>
                        <span>* Max Image size: 3MB</span>
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
