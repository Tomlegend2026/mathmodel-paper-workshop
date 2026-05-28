import { useState, useEffect } from 'react';
import { Button, Card, Input, Steps, Tag, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, BulbOutlined, FileTextOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../../project/api';
import { useProjectStore } from '../../project/store';
import { useAIStore, getAIAdapter, problemAnalysisPrompt, keywordExtractionPrompt, StreamOutput } from '../../ai-engine';
import type { Project } from '../../shared/types';

const { TextArea } = Input;

export default function Step1Page() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [problemTitle, setProblemTitle] = useState('');
  const [problemContent, setProblemContent] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { config, isConfigured } = useAIStore();
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
      const step1Data = data.step_data?.step1;
      if (step1Data) {
        setProblemTitle(step1Data.problem_title || '');
        setProblemContent(step1Data.problem_analysis || '');
        setKeywords(step1Data.keywords || []);
      }
    } catch (error) {
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!problemContent.trim()) {
      message.warning('请先输入题目内容');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    setIsAnalyzing(true);
    try {
      const adapter = getAIAdapter(config);
      const prompt = problemAnalysisPrompt(problemContent);
      const messages = [{ role: 'user' as const, content: prompt }];

      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        setAnalysisResult(result);
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('分析失败，请检查AI配置');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExtractKeywords = async () => {
    if (!problemContent.trim()) {
      message.warning('请先输入题目内容');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    try {
      const adapter = getAIAdapter(config);
      const prompt = keywordExtractionPrompt(problemContent);
      const response = await adapter.generate([{ role: 'user' as const, content: prompt }]);
      const extractedKeywords = response.content
        .split(/[,，、\s]+/)
        .map((k: string) => k.trim())
        .filter((k: string) => k);
      setKeywords(extractedKeywords);
    } catch (error) {
      message.error('提取关键词失败');
    }
  };

  const handleNext = async () => {
    if (!problemTitle.trim() || !problemContent.trim()) {
      message.warning('请填写题目信息');
      return;
    }

    if (!project) return;

    try {
      const updatedProject = await updateProject(project.id, {
        step_data: {
          ...project.step_data,
          step1: {
            problem_title: problemTitle,
            problem_analysis: problemContent,
            keywords,
          },
        },
        step_progress: {
          ...project.step_progress,
          1: 100,
        },
        current_step: 2,
        status: 'in_progress',
        completion_rate: 20,
      });
      updateProjectStore(updatedProject);
      navigate(`/projects/${projectId}/steps/2`);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handlePrevious = () => {
    navigate('/projects');
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
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>选题与解读</h1>
      </div>

      <Steps
        current={0}
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
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 24 }}
      >
        <Form layout="vertical" size="large">
          <Form.Item label="题目名称">
            <Input
              value={problemTitle}
              onChange={(e) => setProblemTitle(e.target.value)}
              placeholder="请输入题目名称"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item label="题目内容">
            <TextArea
              value={problemContent}
              onChange={(e) => setProblemContent(e.target.value)}
              placeholder="请输入完整的题目内容..."
              rows={8}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button
              type="primary"
              icon={<BulbOutlined />}
              onClick={handleAnalyze}
              loading={isAnalyzing}
              disabled={!isConfigured}
              style={{ borderRadius: 8 }}
            >
              AI 分析题目
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={handleExtractKeywords}
              disabled={!isConfigured}
              style={{ borderRadius: 8 }}
            >
              提取关键词
            </Button>
          </div>
        </Form>

        {keywords.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <span style={{ color: '#8b8b9e', marginRight: 12 }}>关键词：</span>
            {keywords.map((keyword, index) => (
              <Tag key={index} color="#6366f1">{keyword}</Tag>
            ))}
          </div>
        )}
      </Card>

      {analysisResult && (
        <Card
          title="AI 分析结果"
          style={{ background: '#2d2d44', borderRadius: 12 }}
          bodyStyle={{ padding: 24 }}
        >
          <StreamOutput content={analysisResult} isStreaming={isAnalyzing} />
        </Card>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
        <Button onClick={handlePrevious} style={{ borderRadius: 8 }}>
          上一步
        </Button>
        <Button
          type="primary"
          icon={<ArrowRightOutlined />}
          onClick={handleNext}
          style={{ borderRadius: 8 }}
        >
          下一步
        </Button>
      </div>
    </div>
  );
}