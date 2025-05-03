import { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Eraser,
  Heading3,
  Heading4,
  Code,
  Minus,
  Quote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function RTEditorMenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttonStyle = (isActive: boolean) =>
    `h-9 w-9 p-0 ${isActive ? 'bg-muted text-primary' : ''}`;

  return (
    <div className="border-border mb-3 flex flex-wrap gap-1 border-b pb-2">
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('bold'))}
        onClick={() => editor.chain().focus().toggleBold().run()}
        type="button"
      >
        <Bold />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('italic'))}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        type="button"
      >
        <Italic />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('heading', { level: 3 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        type="button"
      >
        <Heading3 />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('heading', { level: 4 }))}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        type="button"
      >
        <Heading4 />
      </Button>
      <Button
        size={'icon'}
        variant={editor.isActive('codeBlock') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        type="button"
      >
        <Code />
      </Button>

      <Button
        size={'icon'}
        variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        type="button"
      >
        <Quote />
      </Button>

      <Button
        variant="ghost"
        size={'icon'}
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        type="button"
      >
        <Minus />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('bulletList'))}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        type="button"
      >
        <List />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        className={buttonStyle(editor.isActive('orderedList'))}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        type="button"
      >
        <ListOrdered />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        onClick={() => editor.chain().focus().undo().run()}
        type="button"
      >
        <Undo2 />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        onClick={() => editor.chain().focus().redo().run()}
        type="button"
      >
        <Redo2 />
      </Button>
      <Button
        variant="ghost"
        size={'icon'}
        onClick={() =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        }
        type="button"
      >
        <Eraser />
      </Button>
    </div>
  );
}
