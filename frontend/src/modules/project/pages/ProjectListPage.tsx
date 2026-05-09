import { useEffect, useState } from 'react';
import { Button, Card, Empty, List, Modal, Popconfirm, Progress, message } from 'antd';
import { PlusOutlined, DeleteOutlined, FileTextOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getProjects, createProject, deleteProject } from '../api';
import { useProjectStore } from '../store';

export default function ProjectListPage() {
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const navigate = useNavigate();
  const { projects, setProjects, addProject } = useProjectStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      message.error('加载项目列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!projectTitle.trim()) {
      message.warning('请输入项目名称');
      return;
    }
    try {
      const project = await createProject({ title: projectTitle });
      addProject(project);
      setProjectTitle('');
      setShowCreateModal(false);
      message.success('项目创建成功');
    } catch (error) {
      message.error('创建项目失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleContinue = (project: typeof projects[0]) => {
    navigate(`/projects/${project.id}/steps/${project.current_step}`);
  };

  const handleNewProject = () => {
    navigate('/projects/new');
  };

  const statusText = {
    created: '已创建',
    in_progress: '进行中',
    completed: '已完成',
  };



  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>我的项目</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleNewProject}>
          创建新项目
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="ant-spin-container">
            <div className="ant-spin ant-spin-spinning">
              <span className="ant-spin-dot"></span>
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        <Card
          style={{ textAlign: 'center', padding: 40 }}
          bodyStyle={{ background: '#2d2d44', borderRadius: 12 }}
        >
          <Empty
            description="暂无项目，点击右上角按钮创建"
            style={{ color: '#8b8b9e' }}
          />
        </Card>
      ) : (
        <List
          grid={{ gutter: 16, column: 1 }}
          dataSource={projects}
          renderItem={(project) => (
            <List.Item key={project.id}>
              <Card
                hoverable
                style={{
                  background: '#2d2d44',
                  borderRadius: 12,
                  border: 'none',
                }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FileTextOutlined style={{ fontSize: 24, color: '#6366f1' }} />
                      <div>
                        <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                          {project.title}
                        </h3>
                        <div style={{ display: 'flex', gap: 16, color: '#8b8b9e', fontSize: 14 }}>
                          <span>状态: {statusText[project.status]}</span>
                          <span>当前步骤: 第 {project.current_step} 步</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ color: '#8b8b9e', fontSize: 14 }}>完成进度</span>
                        <span style={{ color: '#fff', fontSize: 14 }}>{Math.round(project.completion_rate)}%</span>
                      </div>
                      <Progress
                        percent={Math.round(project.completion_rate)}
                        strokeColor="#6366f1"
                        showInfo={false}
                        strokeWidth={8}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button
                      icon={<PlayCircleOutlined />}
                      onClick={() => handleContinue(project)}
                      style={{ borderRadius: 8 }}
                    >
                      继续
                    </Button>
                    <Popconfirm
                      title="确定删除该项目？"
                      onConfirm={() => handleDelete(project.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        icon={<DeleteOutlined />}
                        danger
                        style={{ borderRadius: 8 }}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </div>
                </div>
              </Card>
            </List.Item>
          )}
        />
      )}

      <Modal
        title="创建新项目"
        open={showCreateModal}
        onOk={handleCreate}
        onCancel={() => setShowCreateModal(false)}
      >
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          placeholder="请输入项目名称"
          style={{
            width: '100%',
            padding: 12,
            borderRadius: 8,
            border: '1px solid #444',
            background: '#2d2d44',
            color: '#fff',
            outline: 'none',
          }}
        />
      </Modal>
    </div>
  );
}