import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, Steps, message, Tabs, Tooltip } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined, CodeOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../../project/api';
import { useProjectStore } from '../../project/store';
import { useAIStore, getAIAdapter, modelRecommendationPrompt, modelEquationPrompt, codeGenerationPrompt, StreamOutput } from '../../ai-engine';
import { step3GuideTips, withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import MonacoEditor from '@monaco-editor/react';
import type { Project } from '../../../shared/types';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Step3Page() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [modelType, setModelType] = useState('');
  const [modelDescription, setModelDescription] = useState('');
  const [equations, setEquations] = useState('');
  const [code, setCode] = useState('');
  const [recommendationResult, setRecommendationResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { config, isConfigured } = useAIStore();
  const { updateProject: updateProjectStore } = useProjectStore();

  const modelTypes = [
    { value: 'linear-programming', label: '线性规划' },
    { value: 'nonlinear-programming', label: '非线性规划' },
    { value: 'integer-programming', label: '整数规划' },
    { value: 'dynamic-programming', label: '动态规划' },
    { value: 'graph-theory', label: '图论模型' },
    { value: 'machine-learning', label: '机器学习' },
    { value: 'time-series', label: '时间序列' },
    { value: 'optimization', label: '优化模型' },
    { value: 'simulation', label: '仿真模型' },
    { value: 'other', label: '其他' },
  ];

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
      const step2Data = data.step_data?.step2;
      if (!step2Data) {
        navigate(`/projects/${id}/steps/2`);
        return;
      }
      const step3Data = data.step_data?.step3;
      if (step3Data) {
        setModelType(step3Data.model_type || '');
        setModelDescription(step3Data.model_description || '');
        setEquations(step3Data.equations || '');
        setCode(step3Data.code || '');
      }
    } catch (error) {
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendModel = async () => {
    if (!project?.step_data?.step1?.problem_content) {
      message.warning('请先完成第一步');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    setIsGenerating(true);
    try {
      const adapter = getAIAdapter(config);
      const prompt = modelRecommendationPrompt(project.step_data.step1.problem_content);
      const messages = [{ role: 'user' as const, content: prompt }];

      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        setRecommendationResult(result);
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('推荐失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateEquation = async () => {
    if (!project?.step_data?.step1?.problem_content || !modelType) {
      message.warning('请先选择模型类型');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    setIsGenerating(true);
    try {
      const adapter = getAIAdapter(config);
      const prompt = modelEquationPrompt(project.step_data.step1.problem_content, modelType);
      const messages = [{ role: 'user' as const, content: prompt }];

      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        setEquations(result);
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!project?.step_data?.step1?.problem_content || !modelType) {
      message.warning('请先选择模型类型');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    setIsGenerating(true);
    try {
      const adapter = getAIAdapter(config);
      const prompt = codeGenerationPrompt(project.step_data.step1.problem_content, modelType);
      const messages = [{ role: 'user' as const, content: prompt }];

      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        setCode(result);
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = async () => {
    if (!modelType) {
      message.warning('请选择模型类型');
      return;
    }

    if (!project) return;

    try {
      const updatedProject = await updateProject(project.id, {
        step_data: {
          ...project.step_data,
          step3: {
            model_type: modelType,
            model_description: modelDescription,
            equations,
            code,
          },
        },
        step_progress: {
          ...project.step_progress,
          3: 100,
        },
        current_step: 4,
        completion_rate: 60,
      });
      updateProjectStore(updatedProject);
      navigate(`/projects/${projectId}/steps/4`);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handlePrevious = () => {
    navigate(`/projects/${projectId}/steps/2`);
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
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>建模求解</h1>
      </div>

      <Steps
        current={2}
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
          <Form.Item label="选择模型类型">
            {withGuideTip(
              <Select
                value={modelType}
                onChange={(value) => setModelType(value)}
                style={{ width: '100%', borderRadius: 8 }}
                placeholder="请选择模型类型"
                onFocus={() => markTipAsSeen(step3GuideTips.modelType.id)}
              >
                {modelTypes.map((type) => (
                  <Select.Option key={type.value} value={type.value}>
                    {type.label}
                  </Select.Option>
                ))}
              </Select>,
              step3GuideTips.modelType,
              !hasSeenTip(step3GuideTips.modelType.id)
            )}
          </Form.Item>

          <Form.Item label="模型描述">
            {withGuideTip(
              <TextArea
                value={modelDescription}
                onChange={(e) => setModelDescription(e.target.value)}
                placeholder="请描述模型的设计思路..."
                rows={4}
                style={{ borderRadius: 8 }}
                onFocus={() => markTipAsSeen(step3GuideTips.modelDescription.id)}
              />,
              step3GuideTips.modelDescription,
              !hasSeenTip(step3GuideTips.modelDescription.id)
            )}
          </Form.Item>
        </Form>

        {withGuideTip(
          <Button
            type="primary"
            onClick={handleRecommendModel}
            loading={isGenerating}
            disabled={!isConfigured}
            style={{ marginBottom: 16, borderRadius: 8 }}
            onMouseEnter={() => markTipAsSeen(step3GuideTips.recommendModel.id)}
          >
            AI 推荐模型
          </Button>,
          step3GuideTips.recommendModel,
          !hasSeenTip(step3GuideTips.recommendModel.id)
        )}

        {recommendationResult && (
          <div style={{ marginBottom: 16 }}>
            <StreamOutput content={recommendationResult} isStreaming={isGenerating} />
          </div>
        )}
      </Card>

      <Tabs defaultActiveKey="equations" style={{ marginBottom: 16 }}>
        <TabPane tab="数学方程" key="equations">
          <Card style={{ background: '#2d2d44', borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                onClick={handleGenerateEquation}
                loading={isGenerating}
                disabled={!isConfigured || !modelType}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step3GuideTips.generateEquation.id)}
              >
                AI 生成方程
              </Button>,
              step3GuideTips.generateEquation,
              !hasSeenTip(step3GuideTips.generateEquation.id)
            )}
            <StreamOutput content={equations} isStreaming={isGenerating} />
          </Card>
        </TabPane>

        <TabPane tab={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><CodeOutlined /> 代码实现</div>} key="code">
          <Card style={{ background: '#2d2d44', borderRadius: 12 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                onClick={handleGenerateCode}
                loading={isGenerating}
                disabled={!isConfigured || !modelType}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step3GuideTips.generateCode.id)}
              >
                AI 生成代码
              </Button>,
              step3GuideTips.generateCode,
              !hasSeenTip(step3GuideTips.generateCode.id)
            )}
            <MonacoEditor
              height="400px"
              language="python"
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
              }}
            />
          </Card>
        </TabPane>
      </Tabs>

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