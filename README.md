# 微信公众号 Markdown 排版工具

一个基于 React + TailwindCSS + Vite 的微信公众号 Markdown 排版工具，使用 bun 作为包管理器。

## 功能特性

- 📝 实时 Markdown 编辑和预览
- 🎨 多种主题风格（微信绿、优雅紫、科技蓝、简约灰）
- 📱 响应式布局（分屏、编辑器、预览模式）
- 📋 一键复制 HTML 内容到剪贴板
- 💾 导出 HTML 文件
- 🎯 专为微信公众号排版优化

## 安装和运行

确保你已经安装了 [bun](https://bun.sh/)。

```bash
# 安装依赖
bun install

# 启动开发服务器
bun run dev

# 构建生产版本
bun run build

# 预览构建结果
bun run preview
```

## 使用说明

1. 在左侧编辑器中输入 Markdown 内容
2. 右侧实时预览渲染效果
3. 使用顶部工具栏切换主题和布局
4. 点击"复制HTML"将渲染结果复制到剪贴板
5. 点击"导出HTML"下载完整的 HTML 文件

## 主题说明

- **微信绿**：经典微信公众号风格，绿色主题
- **优雅紫**：优雅的紫色主题，适合文艺类内容
- **科技蓝**：科技感蓝色主题，适合技术类文章
- **简约灰**：简约的灰色风格，通用性强

## 技术栈

- React 18
- TypeScript
- TailwindCSS
- Vite
- Marked (Markdown 解析)
- Highlight.js (代码高亮)
- Lucide React (图标)

## 开发

项目使用 bun 作为包管理器和运行时，确保所有命令都使用 bun 执行。