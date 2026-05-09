import { useState, useEffect } from 'react';
import { Button, Card, Input, Steps, Tag, message, Progress, Tooltip, Dropdown, Menu } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, DownloadOutlined, FileTextOutlined, FilePdfOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../../project/api';
import { useProjectStore } from '../../project/store';
import { step5GuideTips, withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import ReactMarkdown from 'react-markdown';
import type { Project } from '../../../shared/types';

const { TextArea } = Input;

export default function Step5Page() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);
  const [newImprovement, setNewImprovement] = useState('');
  const { updateProject: updateProjectStore } = useProjectStore();

  useEffect(() => {
    if (projectId) {
      loadProject(parseInt(projectId));
    }
  }, [projectId]);

  const loadProject = async (id: number) => {
    setLoading(true);
    try {
      const data = await getProject(id);
      setProject(data);
      const step4Data = data.step_data?.step4;
      if (!step4Data) {
        navigate(`/projects/${id}/steps/4`);
        return;
      }
      const step5Data = data.step_data?.step5;
      if (step5Data) {
        setResults(step5Data.results || '');
        setAnalysis(step5Data.analysis || '');
        setImprovements(step5Data.improvements || []);
      }
    } catch (error) {
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!project) return;

    try {
      const updatedProject = await updateProject(project.id, {
        step_data: {
          ...project.step_data,
          step5: {
            results,
            analysis,
            improvements,
          },
        },
        step_progress: {
          ...project.step_progress,
          5: 100,
        },
        current_step: 5,
        status: 'completed',
        completion_rate: 100,
      });
      updateProjectStore(updatedProject);
      message.success('项目完成！');
      navigate('/projects');
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handlePrevious = () => {
    navigate(`/projects/${projectId}/steps/4`);
  };

  const handleDownload = () => {
    if (!project) return;

    const paperContent = generatePaper();
    const blob = new Blob([paperContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('论文已下载');
  };

  const downloadFormats = [
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: 'PDF 格式',
      onClick: async () => {
        try {
          message.loading('正在生成 PDF...', 1);
          const html2pdf = (await import('html2pdf.js')).default;
          const element = document.createElement('div');
          element.style.fontFamily = 'SimSun, serif';
          element.style.fontSize = '12pt';
          element.style.lineHeight = '1.8';
          element.innerHTML = generatePaper().replace(/\n/g, '<br>');
          
          const opt: any = {
            margin: [20, 20, 20, 20] as [number, number, number, number],
            filename: `${project!.title}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          await html2pdf().set(opt).from(element).save();
          message.success('PDF 下载成功');
        } catch (error) {
          message.error('PDF 生成失败，请尝试 Markdown 格式');
        }
      }
    },
    {
      key: 'docx',
      icon: <FileTextOutlined />,
      label: 'Word 格式',
      onClick: async () => {
        try {
          message.loading('正在生成 Word...', 1);
          const { Document, Packer, Paragraph, TextRun, AlignmentType } = await import('docx');
          
          const paperContent = generatePaper();
          const lines = paperContent.split('\n');
          
          const children: any[] = [];
          
          lines.forEach((line) => {
            if (line.startsWith('# ')) {
              // 标题1
              children.push(new Paragraph({
                children: [new TextRun({
                  text: line.replace('# ', ''),
                  bold: true,
                  size: 32,
                  font: 'SimSun'
                })],
                spacing: { before: 240, after: 120 },
                alignment: AlignmentType.CENTER
              }));
            } else if (line.startsWith('## ')) {
              // 标题2
              children.push(new Paragraph({
                children: [new TextRun({
                  text: line.replace('## ', ''),
                  bold: true,
                  size: 28,
                  font: 'SimSun'
                })],
                spacing: { before: 200, after: 100 }
              }));
            } else if (line.startsWith('### ')) {
              // 标题3
              children.push(new Paragraph({
                children: [new TextRun({
                  text: line.replace('### ', ''),
                  bold: true,
                  size: 24,
                  font: 'SimSun'
                })],
                spacing: { before: 160, after: 80 }
              }));
            } else if (line.trim() === '') {
              // 空行
              children.push(new Paragraph({ text: '' }));
            } else if (line.startsWith('---')) {
              // 分隔线
              children.push(new Paragraph({
                children: [new TextRun({ text: '——', size: 18 })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 120, after: 120 }
              }));
            } else {
              // 普通文本
              children.push(new Paragraph({
                children: [new TextRun({
                  text: line,
                  size: 21,
                  font: 'SimSun'
                })],
                spacing: { after: 100 }
              }));
            }
          });
          
          const doc = new Document({
            sections: [{
              properties: {
                page: {
                  margin: { top: 2000, right: 2000, bottom: 2000, left: 2000 }
                }
              },
              children
            }]
          });
          
          const blob = await Packer.toBlob(doc);
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${project!.title}.docx`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          message.success('Word 下载成功');
        } catch (error) {
          message.error('Word 生成失败，请尝试 Markdown 格式');
        }
      }
    },
    {
      key: 'md',
      icon: <DownloadOutlined />,
      label: 'Markdown 格式',
      onClick: handleDownload
    }
  ];

  const generatePaper = (): string => {
    if (!project) return '';

    const step1 = project.step_data?.step1;
    const step2 = project.step_data?.step2;
    const step3 = project.step_data?.step3;
    const step4 = project.step_data?.step4;
    const step5 = project.step_data?.step5;

    return `# ${project.title}

## 摘要
${step4?.sections?.abstract || '待填写'}

## 一、问题重述
${step1?.problem_content || '待填写'}

## 二、模型假设
${step2?.assumptions?.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n') || '待填写'}

## 三、符号说明
待填写

## 四、模型建立与求解
### 4.1 模型选择
${step3?.model_type || '待填写'}

### 4.2 模型描述
${step3?.model_description || '待填写'}

### 4.3 数学方程
${step3?.equations || '待填写'}

### 4.4 求解算法
待填写

## 五、模型检验与分析
${step5?.analysis || '待填写'}

## 六、模型结果
${step5?.results || '待填写'}

## 七、模型优缺点
### 7.1 优点
待填写

### 7.2 改进方向
${step5?.improvements?.map((i: string, idx: number) => `${idx + 1}. ${i}`).join('\n') || '待填写'}

## 八、参考文献
${step4?.references?.join('\n') || '待填写'}

---
*本文由数模论文工坊生成*
`;
  };

  const addImprovement = () => {
    if (newImprovement.trim()) {
      setImprovements([...improvements, newImprovement.trim()]);
      setNewImprovement('');
    }
  };

  const removeImprovement = (index: number) => {
    setImprovements(improvements.filter((_, i) => i !== index));
  };

  if (loading) {
    return <div style={{ padding: 24 }}>加载中...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={handlePrevious}>
          返回
        </Button>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>结果优化</h1>
      </div>

      <Steps
        current={4}
        style={{ marginBottom: 24 }}
        items={[
          { title: '选题解读' },
          { title: '问题分析' },
          { title: '建模求解' },
          { title: '论文写作' },
          { title: '结果优化' },
        ]}
      />

      <Card
        title="完成进度"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        <Progress
          percent={100}
          strokeColor="#52c41a"
          strokeWidth={12}
          format={() => '完成'}
        />
      </Card>

      <Card
        title="结果分析"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <TextArea
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="请总结模型求解的结果..."
            rows={6}
            style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            onFocus={() => markTipAsSeen(step5GuideTips.results.id)}
          />,
          step5GuideTips.results,
          !hasSeenTip(step5GuideTips.results.id)
        )}
      </Card>

      <Card
        title="敏感性分析"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <TextArea
            value={analysis}
            onChange={(e) => setAnalysis(e.target.value)}
            placeholder="请分析模型的敏感性和稳定性..."
            rows={6}
            style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            onFocus={() => markTipAsSeen(step5GuideTips.sensitivity.id)}
          />,
          step5GuideTips.sensitivity,
          !hasSeenTip(step5GuideTips.sensitivity.id)
        )}
      </Card>

      <Card
        title="改进方向"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <div>
            <div style={{ marginBottom: 12 }}>
              <Input
                value={newImprovement}
                onChange={(e) => setNewImprovement(e.target.value)}
                placeholder="输入改进方向..."
                onPressEnter={addImprovement}
                style={{ borderRadius: 8, marginBottom: 8 }}
              />
              <Button onClick={addImprovement} style={{ borderRadius: 8 }}>
                添加
              </Button>
            </div>
            {improvements.map((imp, index) => (
              <Tag key={index} color="#f5222d" closable onClose={() => removeImprovement(index)}>
                {imp}
              </Tag>
            ))}
          </div>,
          step5GuideTips.improvements,
          !hasSeenTip(step5GuideTips.improvements.id)
        )}
      </Card>

      <Card
        title="论文预览"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 24 }}
        bodyStyle={{ padding: 20 }}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto', background: '#1e1e2e', padding: 16, borderRadius: 8, color: '#d4d4d8', lineHeight: 1.6 }}>
          <ReactMarkdown>{generatePaper()}</ReactMarkdown>
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <Button onClick={handlePrevious} style={{ borderRadius: 8 }}>
          上一步
        </Button>
        <Dropdown
          menu={{ items: downloadFormats }}
          placement="bottomRight"
          arrow
        >
          {withGuideTip(
            <Button icon={<DownloadOutlined />} style={{ borderRadius: 8 }}>
              下载论文
            </Button>,
            step5GuideTips.downloadPaper,
            !hasSeenTip(step5GuideTips.downloadPaper.id)
          )}
        </Dropdown>
        {withGuideTip(
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleComplete}
            style={{ borderRadius: 8 }}
            onMouseEnter={() => markTipAsSeen(step5GuideTips.completeProject.id)}
          >
            完成项目
          </Button>,
          step5GuideTips.completeProject,
          !hasSeenTip(step5GuideTips.completeProject.id)
        )}
      </div>
    </div>
  );
}