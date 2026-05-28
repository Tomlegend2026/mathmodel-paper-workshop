import { useState } from 'react';
import { Card, Input, Button, Spin, message, Upload, Tabs } from 'antd';
import { UploadOutlined, SendOutlined, FileTextOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { TextArea } = Input;

export default function PaperReviewPage() {
  const [paperContent, setPaperContent] = useState('');
  const [reviewResult, setReviewResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('input');

  const handleReview = async () => {
    if (!paperContent.trim()) {
      message.warning('请输入论文内容');
      return;
    }

    setLoading(true);
    setActiveTab('result');

    try {
      // 调用后端 API
      const response = await fetch('http://localhost:8000/api/review/paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: paperContent,
        }),
      });

      if (!response.ok) {
        throw new Error('评审失败');
      }

      const data = await response.json();
      setReviewResult(data.review_report);
      message.success('评审完成！');
    } catch (error) {
      message.error('评审失败，请稍后重试');
      console.error('Review error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setPaperContent(text);
      message.success('文件上传成功！');
    };
    reader.readAsText(file);
    return false; // 阻止默认上传行为
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileTextOutlined style={{ fontSize: 24 }} />
            <span>论文评审助手</span>
          </div>
        }
        style={{ borderRadius: 12 }}
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'input',
              label: '输入论文',
              children: (
                <div>
                  <div style={{ marginBottom: 16 }}>
                    <Upload
                      beforeUpload={handleFileUpload}
                      accept=".txt,.md"
                      maxCount={1}
                    >
                      <Button icon={<UploadOutlined />}>上传文本文件</Button>
                    </Upload>
                    <span style={{ marginLeft: 12, color: '#999' }}>
                      支持 .txt 和 .md 格式
                    </span>
                  </div>

                  <TextArea
                    rows={12}
                    placeholder="请粘贴论文内容，或上传文本文件...&#10;&#10;支持格式：&#10;- 数学建模论文&#10;- 学术论文&#10;- 学位论文&#10;- 课程论文"
                    value={paperContent}
                    onChange={(e) => setPaperContent(e.target.value)}
                    style={{ marginBottom: 16, borderRadius: 8 }}
                  />

                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleReview}
                    loading={loading}
                    size="large"
                    block
                    style={{ borderRadius: 8 }}
                  >
                    开始评审
                  </Button>
                </div>
              ),
            },
            {
              key: 'result',
              label: '评审结果',
              children: (
                <div>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <Spin size="large" />
                      <div style={{ marginTop: 16, color: '#999' }}>
                        正在评审中，请稍候...
                      </div>
                    </div>
                  ) : reviewResult ? (
                    <div style={{ padding: 16 }}>
                      <ReactMarkdown>{reviewResult}</ReactMarkdown>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                      暂无评审结果，请先输入论文内容并开始评审
                    </div>
                  )}
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
