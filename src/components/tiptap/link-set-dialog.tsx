import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Editor } from '@tiptap/react';
import { Link2 } from 'lucide-react';
import { useState } from 'react';

type LinkSetDialogProps = {
  editor: Editor;
};

export function LinkSetDialog({ editor }: LinkSetDialogProps) {
  const [url, setUrl] = useState(editor.getAttributes('link').href);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLinkSet = () => {
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setIsDialogOpen(!isDialogOpen);
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={(open) => {
        setIsDialogOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size={'icon'} type="button">
          <Link2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set URL</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <Label htmlFor="url">URL address</Label>
          <Input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(() => e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => setUrl(editor.getAttributes('link').href)}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleLinkSet}>
            Set
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
