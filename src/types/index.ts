export type Theme = 'wechat' | 'elegant' | 'tech' | 'minimal' | 'claude'

export type Layout = 'split' | 'editor-only' | 'preview-only'

export interface ThemeConfig {
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}