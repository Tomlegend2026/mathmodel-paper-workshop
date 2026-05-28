import { useState, useEffect, useRef } from 'react';
import { Spin, Button } from 'antd';
import { RefreshOutlined, CopyOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface StreamOutputProps {
  content: string;
  isStreaming: boolean;
  onRegenerate?: () => void;
  language?: string;
}

export default function StreamOutput({ content, isStreaming, onRegenerate, language }: StreamOutputProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        background: '#1e1e2e',
        borderRadius: 8,
        padding: 16,
        maxHeight: 400,
        overflowY: 'auto',
        border: '1px solid #444',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <Button
          icon={copied ? <CheckCircleOutlined /> : <CopyOutlined />}
          size="small"
          onClick={handleCopy}
          style={{ borderRadius: 6 }}
        >
          {copied ? '已复制' : '复制'}
        </Button>
        {onRegenerate && (
          <Button
            icon={<RefreshOutlined />}
            size="small"
            onClick={onRegenerate}
            style={{ borderRadius: 6 }}
          >
            重新生成
          </Button>
        )}
      </div>

      {isStreaming && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Spin size="small" />
          <span style={{ color: '#8b8b9e' }}>AI 正在思考...</span>
        </div>
      )}

      <div style={{ color: '#d4d4d8', lineHeight: 1.6 }}>
        {language === 'python' ? (
          <pre
            style={{
              background: '#1a1a2e',
              padding: 12,
              borderRadius: 6,
              overflowX: 'auto',
              fontFamily: "'Consolas', 'Monaco', monospace",
              fontSize: 14,
            }}
          >
            <code>{content}</code>
          </pre>
        ) : (
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <pre
                    style={{
                      background: '#1a1a2e',
                      padding: 12,
                      borderRadius: 6,
                      overflowX: 'auto',
                      fontFamily: "'Consolas', 'Monaco', monospace",
                      fontSize: 14,
                    }}
                  >
                    <code {...props}>{children}</code>
                  </pre>
                ) : (
                  <code
                    style={{
                      background: '#3d3d5c',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontFamily: "'Consolas', 'Monaco', monospace",
                    }}
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              math({ node, inline, className, children, ...props }) {
                return (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: katex.renderToString(children as string, {
                        throwOnError: false,
                        displayMode: !inline,
                      }),
                    }}
                    {...props}
                  />
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}