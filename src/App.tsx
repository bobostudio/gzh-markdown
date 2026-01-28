import { useState, useCallback } from "react";
import { Eye, EyeOff } from "lucide-react";
import MarkdownEditor from "./components/MarkdownEditor";
import MarkdownPreview from "./components/MarkdownPreview";
import ThemeSelector from "./components/ThemeSelector";
import LayoutSelector from "./components/LayoutSelector";
import { Theme, Layout } from "./types";
import { copyToWeChat } from "./utils/copy";

const defaultMarkdown = `# 微信公众号标题

## 这是一个二级标题

这是一段正文内容，支持**粗体**和*斜体*文字。你可以在这里写下你的文章内容。

### 三级标题

> 这是一个引用块，可以用来突出重要信息或者引用他人的话。

- 这是无序列表项1
- 这是无序列表项2
- 这是无序列表项3

1. 这是有序列表项1
2. 这是有序列表项2
3. 这是有序列表项3

\`\`\`javascript
// 这是代码块
function hello() {
  console.log("Hello, WeChat!");
}
\`\`\`

这是一段包含\`行内代码\`的文字。

![图片描述](https://bpic.588ku.com/element_origin_min_pic/23/07/11/d32dabe266d10da8b21bd640a2e9b611.jpg!r650)

---

**感谢阅读！**`;

function App() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);
  const [theme, setTheme] = useState<Theme>("claude");
  const [layout, setLayout] = useState<Layout>("split");
  const [showPreview, setShowPreview] = useState(true);

  const handleExport = useCallback(() => {
    const previewElement = document.querySelector(".markdown-preview");
    if (previewElement) {
      const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>微信公众号文章</title>
  <style>
    body { font-family: 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    ${document.querySelector("style")?.textContent || ""}
  </style>
</head>
<body>
  ${previewElement.innerHTML}
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "wechat-article.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部工具栏 */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">
                微信公众号 Markdown 排版工具
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeSelector theme={theme} onThemeChange={setTheme} />
              <LayoutSelector layout={layout} onLayoutChange={setLayout} />

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showPreview ? "隐藏预览" : "显示预览"}</span>
              </button>

              <button
                onClick={async () => {
                  try {
                    const { jsPDF } = await import("jspdf");
                    const html2canvas = (await import("html2canvas")).default;

                    const previewElement =
                      document.querySelector(".markdown-preview");
                    if (!previewElement) return;

                    const canvas = await html2canvas(
                      previewElement as HTMLElement,
                      {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: "#fbf9f6",
                        width: previewElement.scrollWidth,
                        height: previewElement.scrollHeight,
                        windowWidth: previewElement.scrollWidth,
                        windowHeight: previewElement.scrollHeight,
                      },
                    );

                    // 创建PDF
                    const imgData = canvas.toDataURL("image/png", 1.0);
                    const pdf = new jsPDF("p", "mm", "a4");

                    const pdfWidth = 210; // A4宽度 mm
                    const pdfHeight = 297; // A4高度 mm
                    const margin = 10; // 边距 mm
                    const contentWidth = pdfWidth - 2 * margin;

                    // 计算图片在PDF中的尺寸
                    const imgWidth = canvas.width;
                    const imgHeight = canvas.height;
                    const ratio = Math.min(
                      contentWidth / (imgWidth * 0.264583),
                      (pdfHeight - 2 * margin) / (imgHeight * 0.264583),
                    );

                    const scaledWidth = imgWidth * 0.264583 * ratio;
                    const scaledHeight = imgHeight * 0.264583 * ratio;

                    // 如果内容高度小于一页，直接添加
                    if (scaledHeight <= pdfHeight - 2 * margin) {
                      pdf.addImage(
                        imgData,
                        "PNG",
                        margin,
                        margin,
                        scaledWidth,
                        scaledHeight,
                      );
                    } else {
                      // 内容需要分页
                      const pageContentHeight = pdfHeight - 2 * margin;
                      const totalPages = Math.ceil(
                        scaledHeight / pageContentHeight,
                      );

                      for (let i = 0; i < totalPages; i++) {
                        if (i > 0) pdf.addPage();

                        const yOffset = -i * pageContentHeight;
                        pdf.addImage(
                          imgData,
                          "PNG",
                          margin,
                          margin + yOffset,
                          scaledWidth,
                          scaledHeight,
                        );
                      }
                    }

                    // 保存PDF
                    pdf.save("微信公众号文章.pdf");
                  } catch (error) {
                    console.error("PDF导出失败:", error);
                    alert("PDF导出失败，请稍后重试");
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                title="导出为PDF文件"
              >
                <span>📄</span>
                <span>导出PDF</span>
              </button>

              <button
                onClick={async () => {
                  try {
                    const html2canvas = (await import("html2canvas")).default;
                    const previewElement =
                      document.querySelector(".markdown-preview");
                    if (!previewElement) return;

                    const canvas = await html2canvas(
                      previewElement as HTMLElement,
                      {
                        scale: 2,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: "#fbf9f6",
                        width: previewElement.scrollWidth,
                        height: previewElement.scrollHeight,
                        windowWidth: previewElement.scrollWidth,
                        windowHeight: previewElement.scrollHeight,
                      },
                    );

                    // 下载图片
                    const link = document.createElement("a");
                    link.href = canvas.toDataURL("image/png");
                    link.download = "微信公众号文章.png";
                    link.click();
                  } catch (error) {
                    console.error("图片导出失败:", error);
                    alert("图片导出失败，请稍后重试");
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                title="导出为图片，背景色不会丢失"
              >
                <span>🖼️</span>
                <span>导出图片</span>
              </button>

              <button
                onClick={() => {
                  const previewElement =
                    document.querySelector(".markdown-preview");
                  if (previewElement) {
                    try {
                      copyToWeChat(previewElement as HTMLElement);
                      alert("内容已复制到剪贴板！\n请直接在微信公众号后台粘贴 (Ctrl+V)");
                    } catch (error) {
                      console.error("复制失败:", error);
                      alert("复制失败，请重试");
                    }
                  }
                }}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                title="复制格式化内容，可直接粘贴到微信公众号"
              >
                <span>📋</span>
                <span>复制到微信公众号</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
          className={`grid gap-6 ${
            layout === "split"
              ? "grid-cols-2"
              : layout === "editor-only"
                ? "grid-cols-1"
                : "grid-cols-1"
          }`}
        >
          {/* 编辑器 */}
          {layout !== "preview-only" && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b px-4 py-3">
                <h2 className="text-lg font-medium text-gray-900">
                  Markdown 编辑器
                </h2>
              </div>
              <MarkdownEditor value={markdown} onChange={setMarkdown} />
            </div>
          )}

          {/* 预览区域 */}
          {layout !== "editor-only" && showPreview && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="border-b px-4 py-3 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">预览效果</h2>
              </div>
              <MarkdownPreview markdown={markdown} theme={theme} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
