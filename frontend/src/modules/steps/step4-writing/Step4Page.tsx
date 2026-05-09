import { useState, useEffect } from 'react';
import { Button, Card, Input, Steps, Tabs, message, Tooltip } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { getProject, updateProject } from '../../project/api';
import { useProjectStore } from '../../project/store';
import { useAIStore, getAIAdapter, paperOutlinePrompt, abstractWritingPrompt, introductionPrompt, conclusionPrompt, referencePrompt } from '../../ai-engine';
import { step4GuideTips, withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import type { Project } from '../../../shared/types';

const { TabPane } = Tabs;
const { TextArea } = Input;

export default function Step4Page() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Record<string, string>>({
    abstract: '',
    introduction: '',
    model: '',
    result: '',
    conclusion: '',
  });
  const [references, setReferences] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
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
      const step3Data = data.step_data?.step3;
      if (!step3Data) {
        navigate(`/projects/${id}/steps/3`);
        return;
      }
      const step4Data = data.step_data?.step4;
      if (step4Data) {
        setSections(step4Data.sections || sections);
        setReferences(step4Data.references?.join('\n') || '');
      }
    } catch (error) {
      message.error('加载项目失败');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateSection = async (section: string) => {
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
      let prompt = '';
      const modelType = project.step_data?.step3?.model_type || '';

      switch (section) {
        case 'abstract':
          prompt = abstractWritingPrompt(project.step_data.step1.problem_content, modelType);
          break;
        case 'introduction':
          prompt = introductionPrompt(project.step_data.step1.problem_content);
          break;
        case 'conclusion':
          prompt = conclusionPrompt(project.step_data.step1.problem_content, '');
          break;
        case 'outline':
          prompt = paperOutlinePrompt(project.step_data.step1.problem_content);
          break;
        case 'references':
          prompt = referencePrompt(project.step_data.step1.problem_content);
          break;
      }

      const messages = [{ role: 'user' as const, content: prompt }];
      let result = '';
      for await (const chunk of adapter.stream(messages)) {
        result = chunk.content;
        if (section === 'references') {
          setReferences(result);
        } else if (section === 'outline') {
          // Outline is just displayed
        } else {
          setSections((prev) => ({ ...prev, [section]: result }));
        }
        if (chunk.done) break;
      }
    } catch (error) {
      message.error('生成失败');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNext = async () => {
    if (!project) return;

    try {
      const updatedProject = await updateProject(project.id, {
        step_data: {
          ...project.step_data,
          step4: {
            sections,
            references: references.split('\n').filter((r) => r.trim()),
          },
        },
        step_progress: {
          ...project.step_progress,
          4: 100,
        },
        current_step: 5,
        completion_rate: 80,
      });
      updateProjectStore(updatedProject);
      navigate(`/projects/${projectId}/steps/5`);
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handlePrevious = () => {
    navigate(`/projects/${projectId}/steps/3`);
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
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>论文写作</h1>
      </div>

      <Steps
        current={3}
        style={{ marginBottom: 24 }}
        items={[
          { title: '选题解读' },
          { title: '问题分析' },
          { title: '建模求解' },
          { title: '论文写作' },
          { title: '结果优化' },
        ]}
      />

      <Tabs defaultActiveKey="abstract">
        <TabPane tab="摘要" key="abstract">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                type="primary"
                onClick={() => handleGenerateSection('abstract')}
                loading={isGenerating}
                disabled={!isConfigured}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step4GuideTips.abstract.id)}
              >
                AI 生成摘要
              </Button>,
              step4GuideTips.abstract,
              !hasSeenTip(step4GuideTips.abstract.id)
            )}
            <TextArea
              value={sections.abstract}
              onChange={(e) => setSections((prev) => ({ ...prev, abstract: e.target.value }))}
              placeholder="在此输入摘要内容..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            />
          </Card>
        </TabPane>

        <TabPane tab="引言" key="introduction">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                type="primary"
                onClick={() => handleGenerateSection('introduction')}
                loading={isGenerating}
                disabled={!isConfigured}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step4GuideTips.introduction.id)}
              >
                AI 生成引言
              </Button>,
              step4GuideTips.introduction,
              !hasSeenTip(step4GuideTips.introduction.id)
            )}
            <TextArea
              value={sections.introduction}
              onChange={(e) => setSections((prev) => ({ ...prev, introduction: e.target.value }))}
              placeholder="在此输入引言内容..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            />
          </Card>
        </TabPane>

        <TabPane tab="模型建立" key="model">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            <TextArea
              value={sections.model}
              onChange={(e) => setSections((prev) => ({ ...prev, model: e.target.value }))}
              placeholder="在此输入模型建立与求解内容..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            />
          </Card>
        </TabPane>

        <TabPane tab="结果分析" key="result">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            <TextArea
              value={sections.result}
              onChange={(e) => setSections((prev) => ({ ...prev, result: e.target.value }))}
              placeholder="在此输入结果分析内容..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            />
          </Card>
        </TabPane>

        <TabPane tab="结论" key="conclusion">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                type="primary"
                onClick={() => handleGenerateSection('conclusion')}
                loading={isGenerating}
                disabled={!isConfigured}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step4GuideTips.conclusion.id)}
              >
                AI 生成结论
              </Button>,
              step4GuideTips.conclusion,
              !hasSeenTip(step4GuideTips.conclusion.id)
            )}
            <TextArea
              value={sections.conclusion}
              onChange={(e) => setSections((prev) => ({ ...prev, conclusion: e.target.value }))}
              placeholder="在此输入结论内容..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
            />
          </Card>
        </TabPane>

        <TabPane tab="参考文献" key="references">
          <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 16 }} bodyStyle={{ padding: 20 }}>
            {withGuideTip(
              <Button
                type="primary"
                onClick={() => handleGenerateSection('references')}
                loading={isGenerating}
                disabled={!isConfigured}
                style={{ marginBottom: 16, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(step4GuideTips.references.id)}
              >
                AI 推荐参考文献
              </Button>,
              step4GuideTips.references,
              !hasSeenTip(step4GuideTips.references.id)
            )}
            <TextArea
              value={references}
              onChange={(e) => setReferences(e.target.value)}
              placeholder="在此输入参考文献..."
              rows={12}
              style={{ borderRadius: 8, background: '#1e1e2e', color: '#d4d4d8' }}
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