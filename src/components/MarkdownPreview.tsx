import React, { useMemo, useRef } from 'react'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'
import { Theme } from '../types'

interface MarkdownPreviewProps {
  markdown: string
  theme: Theme
}

// 配置 marked 使用 marked-highlight 扩展
marked.use(markedHighlight({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (err) {
        console.error('Highlight error:', err)
      }
    }
    return hljs.highlightAuto(code).value
  }
}))

// 配置其他 marked 选项
marked.setOptions({
  breaks: true,
  gfm: true
})

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ markdown, theme }) => {
  const previewRef = useRef<HTMLDivElement>(null)
  
  const htmlContent = useMemo(() => {
    try {
      // 直接返回 marked 解析的 HTML，不添加内联样式
      // 样式通过 CSS 类来控制，支持主题切换
      return marked(markdown)
    } catch (error) {
      console.error('Markdown parsing error:', error)
      return '<p>Markdown 解析错误</p>'
    }
  }, [markdown])



  return (
    <div className={`h-[calc(100vh-200px)] overflow-y-auto theme-${theme}`}>
      <div 
        ref={previewRef}
        className="markdown-preview markdown-body p-6 max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}

export default MarkdownPreview