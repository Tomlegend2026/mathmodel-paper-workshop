/**
 * Agent 集群测试页面
 * 用于快速测试和验证 Agent 功能
 */

import { useState } from 'react';
import { Card, Button, Input, message, Tabs, Statistic, Row, Col } from 'antd';
import { RocketOutlined, ThunderboltOutlined, ExperimentOutlined } from '@ant-design/icons';
import { createAgentService } from '../services/agent-service';
import { globalAgentMonitor } from '../agent/monitor';

const { TextArea } = Input;

export default function AgentTestPage() {
  const [problemContent, setProblemContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState('1');

  // 示例题目
  const sampleProblems = [
    {
      title: '交通流量优化',
      content: `某城市主要道路在早晚高峰期间经常出现严重拥堵。已知：
1. 城市有 10 个主要路口，每个路口有 4 个方向的信号灯
2. 各时段车流量统计数据已提供
3. 现有信号灯配时方案效果不佳

请建立数学模型，优化信号灯配时方案，使得：
- 主要道路通行效率最高
- 平均等待时间最短
- 碳排放量最小`
    },
    {
      title: '疫情预测模型',
      content: `根据某地区过去 6 个月的疫情数据，包括：
- 每日新增确诊病例
- 每日治愈出院人数
- 每日死亡人数
- 核酸检测数量

请建立预测模型，预测未来 30 天的疫情发展趋势，并评估不同防控措施的效果。`
    }
  ];

  // 测试单个步骤
  const testSingleStep = async (step: number) => {
    if (!problemContent.trim()) {
      message.warning('请先输入题目内容');
      return;
    }

    setLoading(true);
    try {
      const agentService = createAgentService();
      let response;

      switch (step) {
        case 1:
          response = await agentService.analyzeProblem(problemContent);
          break;
        case 2:
          response = await agentService.designModel(results[1] || problemContent);
          break;
        case 3:
          response = await agentService.generateCode(results[2] || problemContent);
          break;
        case 4:
          response = await agentService.writePaper(
            Object.values(results).join('\n\n'),
            '摘要'
          );
          break;
        case 5:
          response = await agentService.optimizeResults(
            Object.values(results).join('\n\n')
          );
          break;
        default:
          throw new Error('无效的步骤');
      }

      setResults(prev => ({
        ...prev,
        [step]: response.content
      }));

      message.success(`✅ Step ${step} 完成！耗时: ${response.metadata.executionTime}ms`);
      setActiveTab(String(step));
    } catch (error) {
      console.error(error);
      message.error(`❌ Step ${step} 失败`);
    } finally {
      setLoading(false);
    }
  };

  // 测试完整工作流
  const testFullWorkflow = async () => {
    if (!problemContent.trim()) {
      message.warning('请先输入题目内容');
      return;
    }

    setLoading(true);
    message.loading({ content: '正在执行完整工作流...', key: 'workflow', duration: 0 });

    try {
      const agentService = createAgentService();
      const workflowResults = await agentService.executeFullWorkflow(problemContent);

      // 保存所有结果
      const newResults: Record<number, string> = {};
      Object.entries(workflowResults).forEach(([step, response]: [string, any]) => {
        newResults[parseInt(step)] = response.content;
      });

      setResults(newResults);

      // 显示统计信息
      const stats = agentService.getWorkflowStats();
      message.success({
        content: `✅ 完整工作流完成！总耗时: ${(stats.totalExecutionTime / 1000).toFixed(1)}s`,
        key: 'workflow'
      });

      // 显示性能报告
      const report = globalAgentMonitor.generateReport();
      console.log('性能报告:', report);
    } catch (error) {
      console.error(error);
      message.error({ content: '❌ 工作流执行失败', key: 'workflow' });
    } finally {
      setLoading(false);
    }
  };

  // 查看性能报告
  const showPerformanceReport = () => {
    const report = globalAgentMonitor.generateReport();
    console.log('=== 性能报告 ===');
    console.log('总调用次数:', report.summary.totalCalls);
    console.log('总 Token 数:', report.summary.totalTokens);
    console.log('平均执行时间:', report.summary.overallAverageTime, 'ms');
    console.log('错误次数:', report.summary.totalErrors);
    console.log('\n优化建议:');
    report.recommendations.forEach(rec => console.log('-', rec));

    message.info('性能报告已输出到控制台');
  };

  // 重置
  const handleReset = () => {
    setProblemContent('');
    setResults({});
    setActiveTab('1');
    globalAgentMonitor.reset();
    message.success('已重置');
  };

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Card
        title={
          <span>
            <RocketOutlined style={{ marginRight: 8 }} />
            Agent 集群测试平台
          </span>
        }
        extra={
          <Button onClick={handleReset} disabled={loading}>
            重置
          </Button>
        }
        style={{ marginBottom: 16 }}
      >
        <TextArea
          placeholder="请输入数学建模题目内容..."
          value={problemContent}
          onChange={e => setProblemContent(e.target.value)}
          rows={8}
          disabled={loading}
        />

        <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => testSingleStep(1)}
            loading={loading}
            disabled={!problemContent.trim()}
          >
            Step 1: 选题分析
          </Button>

          <Button
            type="primary"
            onClick={() => testSingleStep(2)}
            loading={loading}
            disabled={!problemContent.trim() || !results[1]}
          >
            Step 2: 建模设计
          </Button>

          <Button
            type="primary"
            onClick={() => testSingleStep(3)}
            loading={loading}
            disabled={!problemContent.trim() || !results[2]}
          >
            Step 3: 代码生成
          </Button>

          <Button
            type="primary"
            onClick={() => testSingleStep(4)}
            loading={loading}
            disabled={!problemContent.trim() || !results[3]}
          >
            Step 4: 论文写作
          </Button>

          <Button
            type="primary"
            onClick={() => testSingleStep(5)}
            loading={loading}
            disabled={!problemContent.trim() || !results[4]}
          >
            Step 5: 结果优化
          </Button>

          <Button
            type="dashed"
            icon={<ExperimentOutlined />}
            onClick={testFullWorkflow}
            loading={loading}
            disabled={!problemContent.trim()}
            style={{ marginLeft: 'auto' }}
          >
            🚀 一键执行完整工作流
          </Button>

          <Button onClick={showPerformanceReport}>
            📊 查看性能报告
          </Button>
        </div>

        {/* 示例题目 */}
        <div style={{ marginTop: 16 }}>
          <strong>示例题目：</strong>
          {sampleProblems.map((problem, index) => (
            <Button
              key={index}
              size="small"
              style={{ marginLeft: 8 }}
              onClick={() => setProblemContent(problem.content)}
              disabled={loading}
            >
              {problem.title}
            </Button>
          ))}
        </div>
      </Card>

      {/* 结果显示区域 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: '1',
            label: 'Step 1: 选题分析',
            children: (
              <Card>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {results[1] || '暂无结果'}
                </pre>
              </Card>
            )
          },
          {
            key: '2',
            label: 'Step 2: 建模设计',
            children: (
              <Card>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {results[2] || '暂无结果'}
                </pre>
              </Card>
            )
          },
          {
            key: '3',
            label: 'Step 3: 代码生成',
            children: (
              <Card>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {results[3] || '暂无结果'}
                </pre>
              </Card>
            )
          },
          {
            key: '4',
            label: 'Step 4: 论文写作',
            children: (
              <Card>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {results[4] || '暂无结果'}
                </pre>
              </Card>
            )
          },
          {
            key: '5',
            label: 'Step 5: 结果优化',
            children: (
              <Card>
                <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                  {results[5] || '暂无结果'}
                </pre>
              </Card>
            )
          }
        ]}
      />

      {/* 性能统计 */}
      {Object.keys(results).length > 0 && (
        <Card title="📊 性能统计" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="已完成步骤"
                value={Object.keys(results).length}
                suffix="/ 5"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="平均执行时间"
                value={globalAgentMonitor.generateReport().summary.overallAverageTime.toFixed(0)}
                suffix="ms"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="总 Token 消耗"
                value={globalAgentMonitor.generateReport().summary.totalTokens}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="错误次数"
                value={globalAgentMonitor.generateReport().summary.totalErrors}
                valueStyle={{ color: '#cf1322' }}
              />
            </Col>
          </Row>
        </Card>
      )}
    </div>
  );
}
