import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { RTEditorMenuBar } from './menu-bar';

type TipTapRTEditorProps = {
  value: string;
  onChange: (value: string) => void;
  isContentEmptyHandler: (value: boolean) => void;
};

export function TipTapRTEditor({
  value,
  onChange,
  isContentEmptyHandler,
}: TipTapRTEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write down here...',
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          'outline-none text-sm text-foreground prose dark:prose-invert max-w-none prose-headings:mt-2 prose-headings:mb-1 prose-headings:font-semibold prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:marker:text-foreground',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      if (editor.isEmpty) {
        isContentEmptyHandler(true);
      } else {
        isContentEmptyHandler(false);
      }
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <>
      <RTEditorMenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
}

//   return (
//     <div
//       className={`transition-all duration-300 ease-in-out ${
//         collapsed ? 'h-auto overflow-hidden' : 'h-auto'
//       }`}
//     >
//       <div className="border-border bg-background rounded-md border p-2 shadow-sm">
//         {collapsed ? (
//           <>
//             <input
//               type="text"
//               defaultValue={'Join the conversation...'}
//               className="text-muted-foreground w-full bg-transparent text-sm outline-none"
//               onFocus={handleFocus}
//               readOnly
//             />
//           </>
//         ) : (
//           <>
//             <RTEditorMenuBar editor={editor} />
//             <EditorContent editor={editor} />
//             <div className="flex justify-end gap-2 pt-2">
//               <Button variant="outline" onClick={handleCancel}>
//                 Cancel
//               </Button>
//               <Button>Submit</Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
