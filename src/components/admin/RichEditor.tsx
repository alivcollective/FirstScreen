'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Minus, Undo2, Redo2, AlertTriangle,
  ShieldCheck, BookOpen, Code,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Toolbar button ────────────────────────────────────────────

function ToolbarBtn({
  onClick, active, disabled, children, title,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
        active ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700',
        disabled && 'opacity-30 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-slate-700 mx-0.5" />
}

// ── Medical callout inserter ──────────────────────────────────

function insertCallout(editor: Editor, type: 'warning' | 'emergency' | 'evidence') {
  const blocks = {
    warning: `<blockquote><strong>ข้อมูลนี้ใช้เพื่อการศึกษา</strong><br/>ไม่ใช่การวินิจฉัยโรค ควรปรึกษาแพทย์</blockquote>`,
    emergency: `<blockquote><strong>หากมีอาการรุนแรง</strong><br/>ควรพบแพทย์ทันที หรือโทร 1669</blockquote>`,
    evidence: `<blockquote><strong>ระดับหลักฐาน</strong><br/>อ้างอิงจาก: [ระบุแหล่งอ้างอิง]</blockquote>`,
  }
  editor.chain().focus().insertContent(blocks[type]).run()
}

// ── Toolbar ───────────────────────────────────────────────────

function EditorToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  return (
    <div className="flex items-center flex-wrap gap-0.5 px-3 py-2 border-b border-slate-700 bg-slate-800/50">
      {/* History */}
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo2 className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Headings */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        active={editor.isActive('heading', { level: 1 })} title="Heading 1">
        <Heading1 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        active={editor.isActive('heading', { level: 2 })} title="Heading 2">
        <Heading2 className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        active={editor.isActive('heading', { level: 3 })} title="Heading 3">
        <Heading3 className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Marks */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()}
        active={editor.isActive('bold')} title="Bold">
        <Bold className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()}
        active={editor.isActive('italic')} title="Italic">
        <Italic className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()}
        active={editor.isActive('strike')} title="Strikethrough">
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()}
        active={editor.isActive('code')} title="Code">
        <Code className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Lists */}
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()}
        active={editor.isActive('bulletList')} title="Bullet List">
        <List className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()}
        active={editor.isActive('orderedList')} title="Numbered List">
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()}
        active={editor.isActive('blockquote')} title="Quote">
        <Quote className="h-3.5 w-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider">
        <Minus className="h-3.5 w-3.5" />
      </ToolbarBtn>

      <Divider />

      {/* Medical blocks */}
      <ToolbarBtn onClick={() => insertCallout(editor, 'warning')} title="Medical Warning Block">
        <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => insertCallout(editor, 'emergency')} title="Emergency Block">
        <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => insertCallout(editor, 'evidence')} title="Evidence Block">
        <BookOpen className="h-3.5 w-3.5 text-teal-400" />
      </ToolbarBtn>
    </div>
  )
}

// ── Main Editor ───────────────────────────────────────────────

interface RichEditorProps {
  value?: Record<string, unknown>
  onChange?: (json: Record<string, unknown>, html: string) => void
  placeholder?: string
  className?: string
  minHeight?: number
}

export function RichEditor({
  value,
  onChange,
  placeholder = 'เริ่มเขียนเนื้อหา...',
  className,
  minHeight = 400,
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value && Object.keys(value).length > 0 ? value : '',
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getJSON() as Record<string, unknown>, e.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm max-w-none focus:outline-none px-5 py-4',
        style: `min-height: ${minHeight}px`,
      },
    },
  })

  // Sync external value changes
  useEffect(() => {
    if (!editor || !value || Object.keys(value).length === 0) return
    const current = editor.getJSON()
    if (JSON.stringify(current) !== JSON.stringify(value)) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  return (
    <div className={cn('rounded-xl border border-slate-700 bg-slate-900 overflow-hidden', className)}>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />

      {/* Word count */}
      {editor && (
        <div className="flex items-center justify-end px-4 py-1.5 border-t border-slate-800 bg-slate-900/50">
          <span className="text-[11px] text-slate-600">
            {editor.storage.characterCount?.characters?.() ?? 0} ตัวอักษร
          </span>
        </div>
      )}
    </div>
  )
}
