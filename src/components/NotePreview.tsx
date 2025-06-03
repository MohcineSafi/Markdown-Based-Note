
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'highlight.js/styles/github.css';

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface NotePreviewProps {
  note: Note;
}

const NotePreview: React.FC<NotePreviewProps> = ({ note }) => {
  const openInNewWindow = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${note.title} - Preview</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 2rem;
                color: #334155;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #1e293b;
                margin-top: 2rem;
                margin-bottom: 1rem;
              }
              code {
                background: #f1f5f9;
                padding: 0.2rem 0.4rem;
                border-radius: 0.25rem;
                font-size: 0.875rem;
              }
              pre {
                background: #f8fafc;
                border: 1px solid #e2e8f0;
                border-radius: 0.5rem;
                padding: 1rem;
                overflow-x: auto;
              }
              blockquote {
                border-left: 4px solid #3b82f6;
                margin: 1rem 0;
                padding-left: 1rem;
                color: #64748b;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 1rem 0;
              }
              th, td {
                border: 1px solid #e2e8f0;
                padding: 0.5rem;
                text-align: left;
              }
              th {
                background: #f8fafc;
                font-weight: 600;
              }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.6/marked.min.js"></script>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
            <script>
              marked.setOptions({
                highlight: function(code, lang) {
                  if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                  }
                  return hljs.highlightAuto(code).value;
                }
              });
              document.getElementById('content').innerHTML = marked.parse(\`${note.content.replace(/`/g, '\\`')}\`);
            </script>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-slate-500" />
            <h2 className="text-lg font-semibold text-slate-800">Preview</h2>
          </div>
          <Button onClick={openInNewWindow} size="sm" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Open in New Window
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-white">
        <div className="max-w-none prose prose-slate prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-slate-800 prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-blockquote:border-l-blue-500 prose-blockquote:text-slate-600">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Custom components for better styling
              h1: ({children}) => <h1 className="text-3xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">{children}</h1>,
              h2: ({children}) => <h2 className="text-2xl font-semibold text-slate-800 mt-8 mb-4">{children}</h2>,
              h3: ({children}) => <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">{children}</h3>,
              code: ({children, className, ...props}) => {
                const isInline = !className || !className.includes('language-');
                return isInline ? (
                  <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              pre: ({children}) => (
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto border border-slate-200">
                  {children}
                </pre>
              ),
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r">
                  {children}
                </blockquote>
              ),
              table: ({children}) => (
                <table className="w-full border-collapse border border-slate-300 my-4">
                  {children}
                </table>
              ),
              th: ({children}) => (
                <th className="border border-slate-300 px-4 py-2 bg-slate-100 font-semibold text-left">
                  {children}
                </th>
              ),
              td: ({children}) => (
                <td className="border border-slate-300 px-4 py-2">
                  {children}
                </td>
              ),
              ul: ({children}) => (
                <ul className="list-disc pl-6 my-4 space-y-1">
                  {children}
                </ul>
              ),
              ol: ({children}) => (
                <ol className="list-decimal pl-6 my-4 space-y-1">
                  {children}
                </ol>
              ),
              li: ({children}) => (
                <li className="text-slate-600">
                  {children}
                </li>
              ),
              a: ({children, href}) => (
                <a 
                  href={href} 
                  className="text-blue-600 hover:text-blue-800 underline decoration-blue-300 hover:decoration-blue-500 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              )
            }}
          >
            {note.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default NotePreview;
