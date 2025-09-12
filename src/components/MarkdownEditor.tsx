import React from 'react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange }) => {
  return (
    <div className="h-[calc(100vh-200px)]">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-full p-4 border-0 resize-none focus:outline-none font-mono text-sm leading-relaxed"
        placeholder="在这里输入你的 Markdown 内容..."
        spellCheck={false}
      />
    </div>
  )
}

export default MarkdownEditor