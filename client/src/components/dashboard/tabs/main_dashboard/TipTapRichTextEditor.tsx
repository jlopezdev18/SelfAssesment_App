import React, { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogPortal,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Eraser,
} from "lucide-react";
import { linkify, normalizeUrl } from "@/utils/formatters";

type Props = {
  value?: string; // initial HTML
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

export default function TipTapRichTextEditor({
  value,
  onChange,
  placeholder,
  className,
}: Props) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Using imported linkify from utils

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList,
      OrderedList,
      ListItem,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Placeholder.configure({
        placeholder: placeholder || "Write something...",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: linkify(value || ""),
    editorProps: {
      attributes: {
        class: 'tiptap-editor min-h-[200px] w-full rounded-md border border-input bg-transparent dark:bg-input/30 p-3 focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] transition-[color,box-shadow]',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (!editor) return;
    const html = editor.getHTML();
    if (typeof value === "string" && value !== html) {
      editor.commands.setContent(linkify(value));
    }
  }, [value, editor]);

  if (!editor) return null;

  const keepFocus = (e: React.MouseEvent) => e.preventDefault();

  const exec = (fn: () => boolean) => {
    const ok = fn();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    if (!ok) editor.chain().focus().setParagraph().run() && fn();
  };

  const openLinkDialog = () => {
    const current = editor.getAttributes("link")?.href || "";
    setLinkUrl(current);
    setLinkOpen(true);
  };

  // Using imported normalizeUrl from utils

  const applyLink = () => {
    const href = normalizeUrl(linkUrl);
    const chain = editor.chain().focus();

    if (!href) {
      chain.unsetLink().run();
      setLinkOpen(false);
      return;
    }

    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain
        .insertContent({
          type: "text",
          text: href,
          marks: [
            {
              type: "link",
              attrs: { href, target: "_blank", rel: "noopener noreferrer" },
            },
          ],
        })
        .run();
    } else {
      chain
        .extendMarkRange("link")
        .setLink({ href, target: "_blank", rel: "noopener noreferrer" })
        .run();
    }
    setLinkOpen(false);
  };

  return (
    <div
      className={[
        "rounded-md border border-input bg-transparent dark:bg-input/30 overflow-hidden",
        className
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <style>
        {`
          /* Light mode text colors */
          .tiptap-editor {
            color: hsl(var(--foreground)) !important;
          }
          .tiptap-editor :where(p, li, blockquote) { color: inherit !important; }
          .tiptap-editor :where(h1,h2,h3,h4,h5,h6) {
            color: hsl(var(--foreground)) !important;
            font-weight: 600;
          }

          /* Links */
          .tiptap-editor a,
          .tiptap-editor a:visited {
            color: hsl(var(--primary));
            text-decoration: underline;
          }

          /* Blockquote */
          .tiptap-editor blockquote {
            border-left: 3px solid hsl(var(--border));
            padding-left: 0.75rem;
            color: hsl(var(--muted-foreground)) !important;
            margin: 0.5rem 0;
          }

          /* Lists */
          .tiptap-editor ul { list-style: disc; padding-left: 1.5rem; }
          .tiptap-editor ol { list-style: decimal; padding-left: 1.5rem; }
          .tiptap-editor li { margin: 0.125rem 0; }

          /* Placeholder */
          .tiptap-editor p.is-editor-empty:first-child::before {
            color: hsl(var(--muted-foreground));
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
          }
        `}
      </style>

      <div
        className="flex flex-wrap items-center gap-1 border-b border-input p-2"
        role="toolbar"
        aria-label="Editor toolbar"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Bold"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Italic"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Underline"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Link"
          onMouseDown={keepFocus}
          onClick={openLinkDialog}
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Bulleted list"
          onMouseDown={keepFocus}
          onClick={() =>
            exec(() => editor.chain().focus().toggleBulletList().run())
          }
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Numbered list"
          onMouseDown={keepFocus}
          onClick={() =>
            exec(() => editor.chain().focus().toggleOrderedList().run())
          }
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Quote"
          onMouseDown={keepFocus}
          onClick={() =>
            exec(() => editor.chain().focus().toggleBlockquote().run())
          }
        >
          <Quote className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Align left"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Align center"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Align right"
          onMouseDown={keepFocus}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="mx-2 h-5 w-px bg-border" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          title="Clear formatting"
          onMouseDown={keepFocus}
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <Eraser className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-2 max-h-64 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Link dialog with Portal to avoid nested dialog warning */}
      <Dialog open={linkOpen} onOpenChange={setLinkOpen}>
        <DialogPortal>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Insert link</DialogTitle>
            </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLink();
                }
              }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setLinkUrl("");
                applyLink();
              }}
            >
              Remove
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLinkOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" onClick={applyLink}>
              Apply
            </Button>
          </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
