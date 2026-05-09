import { useState, useEffect } from 'react';
import { Button, Card, Input, List, Modal, message, Select, Tag, Table, Space, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined, FileTextOutlined, DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { getPapers, createPaper, deletePaper, updatePaper, downloadPaper } from '../api';
import type { PaperKnowledge } from '../api';

const { TextArea } = Input;
const { Option } = Select;

export default function KnowledgePage() {
  const [papers, setPapers] = useState<PaperKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState<number | undefined>();
  const [filterCompetition, setFilterCompetition] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<PaperKnowledge | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [newPaper, setNewPaper] = useState<Partial<PaperKnowledge>>({
    year: new Date().getFullYear(),
    competition: '国赛',
    problem_type: 'A',
    title: '',
    category: '优化',
    difficulty: 3,
    abstract: '',
    summary: '',
    methods_used: [],
    models_used: [],
    tags: [],
    award_level: '',
    source: '自整理',
    search_keywords: '',
  });

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = async () => {
    setLoading(true);
    try {
      const data = await getPapers();
      setPapers(data);
    } catch (error) {
      message.error('加载论文库失败');
    } finally {
      setLoading(false);
    }
  };

  const filteredPapers = papers.filter((paper) => {
    const matchesSearch = !searchTerm || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.abstract || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (paper.search_keywords || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || paper.year === filterYear;
    const matchesCompetition = !filterCompetition || paper.competition === filterCompetition;
    const matchesCategory = !filterCategory || paper.category === filterCategory;
    return matchesSearch && matchesYear && matchesCompetition && matchesCategory;
  });

  const handleCreateOrUpdate = async () => {
    if (!newPaper.title) {
      message.warning('请填写论文标题');
      return;
    }
    try {
      if (editMode && selectedPaper) {
        await updatePaper(selectedPaper.id, newPaper);
        message.success('更新成功');
      } else {
        await createPaper(newPaper as any);
        message.success('添加成功');
      }
      setShowCreateModal(false);
      setEditMode(false);
      setSelectedPaper(null);
      setNewPaper({
        year: new Date().getFullYear(),
        competition: '国赛',
        problem_type: 'A',
        title: '',
        category: '优化',
        difficulty: 3,
        abstract: '',
        summary: '',
        methods_used: [],
        models_used: [],
        tags: [],
        award_level: '',
        source: '自整理',
        search_keywords: '',
      });
      loadPapers();
    } catch (error) {
      message.error(editMode ? '更新失败' : '添加失败');
    }
  };

  const handleEdit = (paper: PaperKnowledge) => {
    setSelectedPaper(paper);
    setNewPaper({
      year: paper.year,
      competition: paper.competition,
      problem_type: paper.problem_type,
      title: paper.title,
      category: paper.category,
      difficulty: paper.difficulty,
      abstract: paper.abstract,
      summary: paper.summary,
      methods_used: paper.methods_used,
      models_used: paper.models_used,
      tags: paper.tags,
      award_level: paper.award_level,
      source: paper.source,
      search_keywords: '',
    });
    setEditMode(true);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePaper(id);
      message.success('删除成功');
      loadPapers();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleDownload = async (paperId: number, fileType: 'pdf' | 'word') => {
    try {
      await downloadPaper(paperId, fileType);
      message.success(`${fileType === 'pdf' ? 'PDF' : 'Word'}文件下载成功`);
    } catch (error: any) {
      message.error(error.message || '下载失败');
    }
  };

  const categories = ['优化', '预测', '评价', '分类', '图论', '其他'];
  const years = [...new Set(papers.map((p) => p.year))].sort((a, b) => b - a);

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width: 80,
    },
    {
      title: '竞赛',
      dataIndex: 'competition',
      key: 'competition',
      width: 100,
      render: (text: string, record: PaperKnowledge) => (
        <span>{record.competition} {record.problem_type}题</span>
      ),
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '获奖等级',
      dataIndex: 'award_level',
      key: 'award_level',
      width: 120,
      render: (text: string) => (
        <Tag color={text?.includes('国一') || text?.includes('O奖') ? 'gold' : 'blue'}>{text || '-'}</Tag>
      ),
    },
    {
      title: '方法',
      dataIndex: 'methods_used',
      key: 'methods_used',
      width: 200,
      render: (methods: string[]) => (
        <Space wrap>
          {methods?.slice(0, 2).map((m: string, i: number) => (
            <Tag key={i} color="purple">{m}</Tag>
          ))}
          {methods?.length > 2 && <Tag>+{methods.length - 2}</Tag>}
        </Space>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: PaperKnowledge) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setSelectedPaper(record);
              setShowDetailModal(true);
            }}
          >
            查看
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这篇论文吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>优秀论文库</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditMode(false);
          setSelectedPaper(null);
          setShowCreateModal(true);
        }}>
          添加论文
        </Button>
      </div>

      <Card style={{ background: '#2d2d44', borderRadius: 12, marginBottom: 24 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <Input
              placeholder="搜索论文..."
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
            allowClear
          >
            {years.map((year) => (
              <Option key={year} value={year}>{year}年</Option>
            ))}
          </Select>
          <Select
            placeholder="竞赛类型"
            value={filterCompetition}
            onChange={setFilterCompetition}
            style={{ width: 120, borderRadius: 8 }}
            allowClear
          >
            <Option value="国赛">国赛</Option>
            <Option value="美赛">美赛</Option>
            <Option value="研赛">研赛</Option>
          </Select>
          <Select
            placeholder="问题类别"
            value={filterCategory}
            onChange={setFilterCategory}
            style={{ width: 120, borderRadius: 8 }}
            allowClear
          >
            {categories.map((cat) => (
              <Option key={cat} value={cat}>{cat}</Option>
            ))}
          </Select>
        </div>
      </Card>

      <Card style={{ background: '#2d2d44', borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
        <Table
          columns={columns}
          dataSource={filteredPapers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          style={{ background: 'transparent' }}
          onRow={(record) => ({
            onClick: () => {
              setSelectedPaper(record);
              setShowDetailModal(true);
            },
            style: { cursor: 'pointer' }
          })}
          onChange={(pagination: any) => {
            // Handle pagination if needed
          }}
        />
      </Card>

      {/* 论文详情 Modal */}
      <Modal
        title={selectedPaper?.title}
        open={showDetailModal}
        onCancel={() => {
          setShowDetailModal(false);
          setSelectedPaper(null);
        }}
        width={900}
        footer={[
          <Button key="close" onClick={() => setShowDetailModal(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedPaper && (
          <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {/* 基本信息 */}
            <Card 
              size="small" 
              style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
              title={<span style={{ color: '#fff' }}>基本信息</span>}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, color: '#d4d4d8' }}>
                <div><strong>年份：</strong>{selectedPaper.year}年</div>
                <div><strong>竞赛：</strong>{selectedPaper.competition} {selectedPaper.problem_type}题</div>
                <div><strong>类别：</strong>{selectedPaper.category}</div>
                <div><strong>难度：</strong>{'⭐'.repeat(selectedPaper.difficulty || 0)}</div>
                <div><strong>获奖等级：</strong>{selectedPaper.award_level || '-'}</div>
                <div><strong>来源：</strong>{selectedPaper.source || '-'}</div>
              </div>
            </Card>

            {/* 摘要 */}
            {selectedPaper.abstract && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>摘要</span>}
              >
                <div style={{ color: '#d4d4d8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {selectedPaper.abstract}
                </div>
              </Card>
            )}

            {/* 内容总结 */}
            {selectedPaper.summary && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>内容总结</span>}
              >
                <div style={{ color: '#d4d4d8', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                  {selectedPaper.summary}
                </div>
              </Card>
            )}

            {/* 使用的方法 */}
            {selectedPaper.methods_used && selectedPaper.methods_used.length > 0 && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>使用的方法</span>}
              >
                <Space wrap>
                  {selectedPaper.methods_used.map((method, index) => (
                    <Tag key={index} color="purple">{method}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* 使用的模型 */}
            {selectedPaper.models_used && selectedPaper.models_used.length > 0 && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>使用的模型</span>}
              >
                <Space wrap>
                  {selectedPaper.models_used.map((model, index) => (
                    <Tag key={index} color="blue">{model}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* 关键点 */}
            {selectedPaper.key_points && Object.keys(selectedPaper.key_points).length > 0 && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>关键点</span>}
              >
                <div style={{ color: '#d4d4d8' }}>
                  {Object.entries(selectedPaper.key_points).map(([key, value]) => (
                    <div key={key} style={{ marginBottom: 8 }}>
                      <strong style={{ color: '#6366f1' }}>{key}：</strong>
                      <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* 标签 */}
            {selectedPaper.tags && selectedPaper.tags.length > 0 && (
              <Card 
                size="small" 
                style={{ marginBottom: 16, background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>标签</span>}
              >
                <Space wrap>
                  {selectedPaper.tags.map((tag, index) => (
                    <Tag key={index} color="#6366f1">{tag}</Tag>
                  ))}
                </Space>
              </Card>
            )}

            {/* 附件路径 */}
            {(selectedPaper.pdf_path || selectedPaper.docx_path || selectedPaper.code_path || selectedPaper.data_path) && (
              <Card 
                size="small" 
                style={{ background: '#2d2d44', border: 'none' }}
                title={<span style={{ color: '#fff' }}>附件</span>}
              >
                <div style={{ color: '#d4d4d8' }}>
                  {selectedPaper.pdf_path && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div><strong>PDF：</strong>{selectedPaper.pdf_path}</div>
                      <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(selectedPaper.id, 'pdf')}
                        size="small"
                      >
                        下载PDF
                      </Button>
                    </div>
                  )}
                  {selectedPaper.docx_path && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <div><strong>Word：</strong>{selectedPaper.docx_path}</div>
                      <Button 
                        type="primary" 
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(selectedPaper.id, 'word')}
                        size="small"
                      >
                        下载Word
                      </Button>
                    </div>
                  )}
                  {selectedPaper.code_path && <div><strong>代码：</strong>{selectedPaper.code_path}</div>}
                  {selectedPaper.data_path && <div><strong>数据：</strong>{selectedPaper.data_path}</div>}
                </div>
              </Card>
            )}
          </div>
        )}
      </Modal>

      {/* 创建/编辑论文 Modal */}
      <Modal
        title={editMode ? '编辑论文' : '添加论文'}
        open={showCreateModal}
        onOk={handleCreateOrUpdate}
        onCancel={() => {
          setShowCreateModal(false);
          setEditMode(false);
          setSelectedPaper(null);
        }}
        width={800}
        okText={editMode ? '更新' : '添加'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Input
            placeholder="论文标题 *"
            value={newPaper.title}
            onChange={(e) => setNewPaper({ ...newPaper, title: e.target.value })}
            style={{ borderRadius: 8 }}
          />
          
          <div style={{ display: 'flex', gap: 12 }}>
            <Select
              value={newPaper.competition}
              onChange={(value) => setNewPaper({ ...newPaper, competition: value })}
              style={{ flex: 1, borderRadius: 8 }}
              placeholder="竞赛类型"
            >
              <Option value="国赛">国赛</Option>
              <Option value="美赛">美赛</Option>
              <Option value="研赛">研赛</Option>
            </Select>
            <Select
              value={newPaper.problem_type}
              onChange={(value) => setNewPaper({ ...newPaper, problem_type: value })}
              style={{ flex: 1, borderRadius: 8 }}
              placeholder="题目类型"
            >
              <Option value="A">A题</Option>
              <Option value="B">B题</Option>
              <Option value="C">C题</Option>
              <Option value="D">D题</Option>
              <Option value="E">E题</Option>
            </Select>
            <Select
              value={newPaper.category}
              onChange={(value) => setNewPaper({ ...newPaper, category: value })}
              style={{ flex: 1, borderRadius: 8 }}
              placeholder="问题类别"
            >
              {categories.map((cat) => (
                <Option key={cat} value={cat}>{cat}</Option>
              ))}
            </Select>
            <Input
              type="number"
              placeholder="难度 1-5"
              value={newPaper.difficulty}
              onChange={(e) => setNewPaper({ ...newPaper, difficulty: parseInt(e.target.value) || 3 })}
              min={1}
              max={5}
              style={{ width: 100, borderRadius: 8 }}
            />
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <Input
              placeholder="获奖等级（如：国一、国二、美赛O奖）"
              value={newPaper.award_level}
              onChange={(e) => setNewPaper({ ...newPaper, award_level: e.target.value })}
              style={{ flex: 1, borderRadius: 8 }}
            />
            <Select
              value={newPaper.source}
              onChange={(value) => setNewPaper({ ...newPaper, source: value })}
              style={{ flex: 1, borderRadius: 8 }}
              placeholder="来源"
            >
              <Option value="自整理">自整理</Option>
              <Option value="知网">知网</Option>
              <Option value="其他">其他</Option>
            </Select>
          </div>

          <TextArea
            placeholder="摘要（用于检索和参考） *"
            value={newPaper.abstract}
            onChange={(e) => setNewPaper({ ...newPaper, abstract: e.target.value })}
            rows={3}
            style={{ borderRadius: 8 }}
          />

          <TextArea
            placeholder="内容总结（问题、方法、结果）"
            value={newPaper.summary}
            onChange={(e) => setNewPaper({ ...newPaper, summary: e.target.value })}
            rows={2}
            style={{ borderRadius: 8 }}
          />

          <div>
            <div style={{ marginBottom: 4, color: '#8b8b9e' }}>使用的方法（逗号分隔）</div>
            <Input
              placeholder="如：线性规划, 遗传算法, 神经网络"
              value={newPaper.methods_used?.join(', ')}
              onChange={(e) => setNewPaper({ 
                ...newPaper, 
                methods_used: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t) 
              })}
              style={{ borderRadius: 8 }}
            />
          </div>

          <div>
            <div style={{ marginBottom: 4, color: '#8b8b9e' }}>使用的模型（逗号分隔）</div>
            <Input
              placeholder="如：整数规划, 网络流, 时间序列"
              value={newPaper.models_used?.join(', ')}
              onChange={(e) => setNewPaper({ 
                ...newPaper, 
                models_used: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t) 
              })}
              style={{ borderRadius: 8 }}
            />
          </div>

          <div>
            <div style={{ marginBottom: 4, color: '#8b8b9e' }}>标签（逗号分隔）</div>
            <Input
              placeholder="如：共享单车, 调度优化, 多目标"
              value={newPaper.tags?.join(', ')}
              onChange={(e) => setNewPaper({ 
                ...newPaper, 
                tags: e.target.value.split(',').map((t: string) => t.trim()).filter((t: string) => t) 
              })}
              style={{ borderRadius: 8 }}
            />
          </div>

          <div>
            <div style={{ marginBottom: 4, color: '#8b8b9e' }}>搜索关键词（用空格分隔，用于检索）</div>
            <Input
              placeholder="如：共享单车 调度 优化 多目标 遗传算法"
              value={newPaper.search_keywords}
              onChange={(e) => setNewPaper({ ...newPaper, search_keywords: e.target.value })}
              style={{ borderRadius: 8 }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
