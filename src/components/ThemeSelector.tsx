import React from 'react'
import { Palette } from 'lucide-react'
import { Theme } from '../types'

interface ThemeSelectorProps {
  theme: Theme
  onThemeChange: (theme: Theme) => void
}

const themes = [
  { id: 'wechat' as Theme, name: '微信绿', description: '经典微信风格' },
  { id: 'elegant' as Theme, name: '优雅紫', description: '优雅紫色主题' },
  { id: 'tech' as Theme, name: '科技蓝', description: '科技感蓝色' },
  { id: 'minimal' as Theme, name: '简约灰', description: '简约灰色风格' },
  { id: 'claude' as Theme, name: 'Claude Sonnet', description: 'Anthropic 橙色主题' }
]

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ theme, onThemeChange }) => {
  return (
    <div className="relative group z-20">
      <button className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
        <Palette size={16} />
        <span>主题</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        <div className="py-1">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onThemeChange(t.id)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                theme === t.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
              }`}
            >
              <div className="font-medium">{t.name}</div>
              <div className="text-xs text-gray-500">{t.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ThemeSelector