import { useState, useEffect } from 'react';
import { Button, Card, Form, Input, Select, message, Steps } from 'antd';
import { ArrowLeftOutlined, FileTextOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../api';
import { useProjectStore } from '../store';
import { getProblems } from '../../wiki/api';
import type { Problem } from '../../../shared/types';

export default function NewProjectPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<number | undefined>();
  const navigate = useNavigate();
  const { addProject } = useProjectStore();

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      message.error('加载题库失败');
    }
  };

  const handleSubmit = async (values: { title: string }) => {
    setLoading(true);
    try {
      const project = await createProject({
        title: values.title,
        problem_id: selectedProblem,
      });
      addProject(project);
      message.success('项目创建成功');
      navigate(`/projects/${project.id}/steps/1`);
    } catch (error) {
      message.error('创建项目失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/projects')}>
          返回
        </Button>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>创建新项目</h1>
      </div>

      <Card
        style={{ maxWidth: 600, margin: '0 auto', background: '#2d2d44', borderRadius: 12 }}
        bodyStyle={{ padding: 24 }}
      >
        <Steps
        current={0}
        style={{ marginBottom: 24 }}
        items={[
          { title: '项目信息' },
          { title: '选题解读' },
          { title: '问题分析' },
          { title: '建模求解' },
          { title: '论文写作' },
        ]}
      />

        <Form onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item
            name="title"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input
              placeholder="请输入项目名称"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item label="选择题目（选填）">
            <Select
              style={{ width: '100%', borderRadius: 8 }}
              placeholder="从题库中选择题目"
              value={selectedProblem}
              onChange={(value) => setSelectedProblem(value)}
            >
              {problems.map((problem) => (
                <Select.Option key={problem.id} value={problem.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileTextOutlined />
                    <span>{problem.year}年 {problem.competition} - {problem.title}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%', borderRadius: 8, height: 44 }}
            >
              开始建模
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}