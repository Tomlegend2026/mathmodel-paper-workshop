import { useState, useEffect } from 'react';
import { Button, Card, Input, List, Modal, message, Select, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons';
import { getProblems, createProblem } from '../api';
import type { Problem } from '../../../shared/types';

const { Option } = Select;

export default function WikiPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | undefined>();
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProblem, setNewProblem] = useState<Omit<Problem, 'id'>>({
    year: new Date().getFullYear(),
    competition: '国赛',
    title: '',
    category: '',
    content: '',
    tags: [],
    difficulty: 1,
  });
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const data = await getProblems();
      setProblems(data);
    } catch (error) {
      message.error('加载题目库失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         problem.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || problem.year === filterYear;
    const matchesCategory = !filterCategory || problem.category === filterCategory;
    return matchesSearch && matchesYear && matchesCategory;
  });

  const handleCreate = async () => {
    if (!newProblem.title || !newProblem.content) {
      message.warning('请填写完整信息');
      return;
    }
    try {
      await createProblem(newProblem);
      setShowCreateModal(false);
      setNewProblem({
        year: new Date().getFullYear(),
        competition: '国赛',
        title: '',
        category: '',
        content: '',
        tags: [],
        difficulty: 1,
      });
      loadProblems();
      message.success('添加成功');
    } catch (error) {
      message.error('添加失败');
    }
  };

  const categories = ['优化', '预测', '评价', '分类', '图论', '其他'];
  const years = [...new Set(problems.map((p) => p.year))].sort((a, b) => b - a);

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>题目库</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setShowCreateModal(true)}>
          添加题目
        </Button>
      </div>

      <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input
              placeholder="搜索题目..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </div>
          <Select
            placeholder="选择年份"
            value={filterYear}
            onChange={setFilterYear}
            style={{ width: 120, borderRadius: 8 }}
          >
            {years.map((year) => (
              <Option key={year} value={year}>{year}年</Option>
            ))}
          </Select>
          <Select
            placeholder="选择类别"
            value={filterCategory}
            onChange={setFilterCategory}
            style={{ width: 120, borderRadius: 8 }}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </div>
      </Card>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={filteredProblems}
        renderItem={(problem) => (
          <List.Item key={problem.id}>
            <Card
              hoverable
              style={{ background: '#2d2d44', borderRadius: 12, border: 'none' }}
              bodyStyle={{ padding: 20 }}
              onClick={() => setSelectedProblem(problem)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileTextOutlined style={{ fontSize: 24, color: '#6366f1' }} />
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>
                        {problem.title}
                      </h3>
                      <div style={{ display: 'flex', gap: 16, color: '#8b8b9e', fontSize: 14 }}>
                        <span>{problem.year}年 {problem.competition}</span>
                        <span>类别: {problem.category}</span>
                        <span>难度: {'⭐'.repeat(problem.difficulty)}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ color: '#8b8b9e', marginTop: 12, lineHeight: 1.6 }}>
                    {problem.content.slice(0, 100)}...
                  </p>
                  <div style={{ marginTop: 12 }}>
                    {problem.tags.map((tag: string, index: number) => (
                      <Tag key={index} color="#6366f1">{tag}</Tag>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />

      {selectedProblem && (
        <Modal
          title={selectedProblem.title}
          open={!!selectedProblem}
          onCancel={() => setSelectedProblem(null)}
          width={800}
        >
          <div style={{ color: '#8b8b9e', marginBottom: 12 }}>
            <span>{selectedProblem.year}年 {selectedProblem.competition}</span>
            <span style={{ marginLeft: 16 }}>类别: {selectedProblem.category}</span>
            <span style={{ marginLeft: 16 }}>难度: {'⭐'.repeat(selectedProblem.difficulty)}</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            {selectedProblem.tags.map((tag: string, index: number) => (
              <Tag key={index} color="#6366f1">{tag}</Tag>
            ))}
          </div>
          <div style={{ whiteSpace: 'pre-wrap', color: '#d4d4d8', lineHeight: 1.8 }}>
            {selectedProblem.content}
          </div>
        </Modal>
      )}

      <Modal
        title="添加题目"
        open={showCreateModal}
        onOk={handleCreate}
        onCancel={() => setShowCreateModal(false)}
      >
        <Input
          placeholder="题目名称"
          value={newProblem.title}
          onChange={(e) => setNewProblem({ ...newProblem, title: e.target.value })}
          style={{ width: '100%', marginBottom: 12, borderRadius: 8 }}
        />
        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
          <Select
            value={newProblem.competition}
            onChange={(value) => setNewProblem({ ...newProblem, competition: value })}
            style={{ flex: 1, borderRadius: 8 }}
          >
            <Option value="国赛">国赛</Option>
            <Option value="美赛">美赛</Option>
            <Option value="研赛">研赛</Option>
          </Select>
          <Select
            value={newProblem.category}
            onChange={(value) => setNewProblem({ ...newProblem, category: value })}
            style={{ flex: 1, borderRadius: 8 }}
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
          <Input
            type="number"
            placeholder="难度"
            value={newProblem.difficulty}
            onChange={(e) => setNewProblem({ ...newProblem, difficulty: parseInt(e.target.value) || 1 })}
            min={1}
            max={5}
            style={{ width: 80, borderRadius: 8 }}
          />
        </div>
        <textarea
          placeholder="题目内容..."
          value={newProblem.content}
          onChange={(e) => setNewProblem({ ...newProblem, content: e.target.value })}
          rows={6}
          style={{ width: '100%', marginBottom: 12, borderRadius: 8, background: '#2d2d44', color: '#fff', padding: 12 }}
        />
        <div>
          <span style={{ color: '#8b8b9e', marginRight: 8 }}>标签：</span>
          <Input
            placeholder="输入标签，逗号分隔"
            value={newProblem.tags.join(',')}
            onChange={(e) => setNewProblem({ ...newProblem, tags: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t) })}
            style={{ width: '60%', borderRadius: 8 }}
          />
        </div>
      </Modal>
    </div>
  );
}