import { useState, useEffect } from 'react';
import { Button, Card, Input, Steps, Tag, message, Tooltip } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../../project/api';
import { useProjectStore } from '../../project/store';
import { useAIStore, getAIAdapter, objectiveAnalysisPrompt, StreamOutput } from '../../ai-engine';
import { step2GuideTips, withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import type { Project } from '../../../shared/types';

export default function Step2Page() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [objectives, setObjectives] = useState<string[]>([]);
  const [constraints, setConstraints] = useState<string[]>([]);
  const [assumptions, setAssumptions] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');
  const [newConstraint, setNewConstraint] = useState('');
  const [newAssumption, setNewAssumption] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
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
      if (!step1Data) {
        navigate(`/projects/${id}/steps/1`);
        return;
      }
      const step2Data = data.step_data?.step2;
      if (step2Data) {
        setObjectives(step2Data.objectives || []);
        setConstraints(step2Data.constraints || []);
        setAssumptions(step2Data.assumptions || []);
      }
    } catch (error) {
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!project?.step_data?.step1?.problem_content) {
      message.warning('请先完成第一步的题目输入');
      return;
    }
    if (!isConfigured) {
      message.warning('请先配置AI设置');
      return;
    }

    setIsAnalyzing(true);
    try {
      const adapter = getAIAdapter(config);
      const prompt = objectiveAnalysisPrompt(project.step_data.step1.problem_content);
      const messages = [{ role: 'user' as const, content: prompt }];

      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        setAnalysisResult(result);
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('分析失败');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = async () => {
    if (!project) return;

    try {
      const updatedProject = await updateProject(project.id, {
        step_data: {
          ...project.step_data,
          step2: {
            objectives,
            constraints,
            assumptions,
          },
        },
        step_progress: {
          ...project.step_progress,
          2: 100,
        },
        current_step: 3,
        completion_rate: 40,
      });
      updateProjectStore(updatedProject);
      navigate(`/projects/${projectId}/steps/3`);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handlePrevious = () => {
    navigate(`/projects/${projectId}/steps/1`);
  };

  const addItem = (value: string, setValue: (v: string) => void, list: string[], setList: (l: string[]) => void) => {
    if (value.trim()) {
      setList([...list, value.trim()]);
      setValue('');
    }
  };

  const removeItem = (index: number, list: string[], setList: (l: string[]) => void) => {
    setList(list.filter((_, i) => i !== index));
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
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>问题分析</h1>
      </div>

      <Steps
        current={1}
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
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            目标分析
          </div>
        }
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <div>
            <div style={{ marginBottom: 12 }}>
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="输入目标..."
                onPressEnter={() => addItem(newObjective, setNewObjective, objectives, setObjectives)}
                style={{ borderRadius: 8, marginBottom: 8 }}
              />
              <Button
                onClick={() => addItem(newObjective, setNewObjective, objectives, setObjectives)}
                style={{ borderRadius: 8 }}
              >
                添加
              </Button>
            </div>
            {objectives.map((obj, index) => (
              <Tag key={index} color="#52c41a" closable onClose={() => removeItem(index, objectives, setObjectives)}>
                {obj}
              </Tag>
            ))}
          </div>,
          step2GuideTips.objectives,
          !hasSeenTip(step2GuideTips.objectives.id)
        )}
      </Card>

      <Card
        title="约束条件"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <div>
            <div style={{ marginBottom: 12 }}>
              <Input
                value={newConstraint}
                onChange={(e) => setNewConstraint(e.target.value)}
                placeholder="输入约束..."
                onPressEnter={() => addItem(newConstraint, setNewConstraint, constraints, setConstraints)}
                style={{ borderRadius: 8, marginBottom: 8 }}
              />
              <Button
                onClick={() => addItem(newConstraint, setNewConstraint, constraints, setConstraints)}
                style={{ borderRadius: 8 }}
              >
                添加
              </Button>
            </div>
            {constraints.map((con, index) => (
              <Tag key={index} color="#faad14" closable onClose={() => removeItem(index, constraints, setConstraints)}>
                {con}
              </Tag>
            ))}
          </div>,
          step2GuideTips.constraints,
          !hasSeenTip(step2GuideTips.constraints.id)
        )}
      </Card>

      <Card
        title="假设条件"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <div>
            <div style={{ marginBottom: 12 }}>
              <Input
                value={newAssumption}
                onChange={(e) => setNewAssumption(e.target.value)}
                placeholder="输入假设..."
                onPressEnter={() => addItem(newAssumption, setNewAssumption, assumptions, setAssumptions)}
                style={{ borderRadius: 8, marginBottom: 8 }}
              />
              <Button
                onClick={() => addItem(newAssumption, setNewAssumption, assumptions, setAssumptions)}
                style={{ borderRadius: 8 }}
              >
                添加
              </Button>
            </div>
            {assumptions.map((ass, index) => (
              <Tag key={index} color="#1890ff" closable onClose={() => removeItem(index, assumptions, setAssumptions)}>
                {ass}
              </Tag>
            ))}
          </div>,
          step2GuideTips.assumptions,
          !hasSeenTip(step2GuideTips.assumptions.id)
        )}
      </Card>

      <Card
        title="AI 辅助分析"
        style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }}
        bodyStyle={{ padding: 20 }}
      >
        {withGuideTip(
          <Button
            type="primary"
            onClick={handleAnalyze}
            loading={isAnalyzing}
            disabled={!isConfigured}
            style={{ marginBottom: 16, borderRadius: 8 }}
            onMouseEnter={() => markTipAsSeen(step2GuideTips.aiAnalysis.id)}
          >
            AI 分析目标与约束
          </Button>,
          step2GuideTips.aiAnalysis,
          !hasSeenTip(step2GuideTips.aiAnalysis.id)
        )}
        {analysisResult && <StreamOutput content={analysisResult} isStreaming={isAnalyzing} />}
      </Card>

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