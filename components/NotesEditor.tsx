
"use client";

import { useEffect } from "react";
import { Extension } from "@tiptap/core";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
});

export default function NotesEditor({
  value,
  onChange,
}: NotesEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[120px] w-full px-4 py-3 outline-none text-sm text-slate-700 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [editor, value]);

  if (!editor) return null;

  const toolbarButton =
    "rounded px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-200";

  const applyFontSize = (increase: boolean) => {
  const { from, to } = editor.state.selection;
  const currentSize = Number(
    editor.getAttributes("textStyle").fontSize?.replace("px", "") || 16
  );

  const newSize = Math.min(
    32,
    Math.max(8, currentSize + (increase ? 2 : -2))
  );

  editor
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .setMark("textStyle", { fontSize: `${newSize}px` })
    .run();
};

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-blue-500">
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 bg-slate-50 p-2">
        <button
          type="button"
          title="Bold"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${toolbarButton} font-bold ${
            editor.isActive("bold")
              ? "bg-blue-100 text-blue-700"
              : ""
          }`}
        >
          B
        </button>

        <div className="h-6 w-px bg-slate-300" />

        <label className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-200">
          <span className="font-medium">Text color</span>
          <input
            type="color"
            title="Choose text color"
            defaultValue="#2563eb"
            className="h-6 w-7 cursor-pointer border-0 bg-transparent p-0"
            onChange={(e) => {
              editor
                .chain()
                .focus()
                .setColor(e.target.value)
                .run();
            }}
          />
        </label>

        <div className="h-6 w-px bg-slate-300" />

        <div className="flex items-center gap-1">
            <button
                type="button"
                title="Decrease font size"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSize(false)}
                className={toolbarButton}
            >
                A−
            </button>

            <button
                type="button"
                title="Increase font size"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFontSize(true)}
                className={toolbarButton}
            >
                A+
            </button>
            </div>

        <div className="h-6 w-px bg-slate-300" />

        <button
          type="button"
          title="Bullet list"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${toolbarButton} ${
            editor.isActive("bulletList")
              ? "bg-blue-100 text-blue-700"
              : ""
          }`}
        >
          • List
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}