import React from 'react'
import { Settings } from 'lucide-react'
import { Layout } from '../types'

interface LayoutSelectorProps {
  layout: Layout
  onLayoutChange: (layout: Layout) => void
}

const layouts = [
  { id: 'split' as Layout, name: '分屏模式', description: '编辑器和预览并排显示' },
  { id: 'editor-only' as Layout, name: '编辑模式', description: '只显示编辑器' },
  { id: 'preview-only' as Layout, name: '预览模式', description: '只显示预览' }
]

const LayoutSelector: React.FC<LayoutSelectorProps> = ({ layout, onLayoutChange }) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
        <Settings size={16} />
        <span>布局</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          {layouts.map((l) => (
            <button
              key={l.id}
              onClick={() => onLayoutChange(l.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                layout === l.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">{l.name}</div>
              <div className="text-xs text-gray-500">{l.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LayoutSelector