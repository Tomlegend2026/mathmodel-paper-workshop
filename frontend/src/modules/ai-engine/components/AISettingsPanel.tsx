import { useState } from 'react';
import { Button, Card, Form, Input, Select, Switch, message } from 'antd';
import { SettingsOutlined, SaveOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAIStore } from '../store';

const { Option } = Select;

export default function AISettingsPanel() {
  const { config, setConfig, isConfigured } = useAIStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    try {
      setConfig(localConfig);
      message.success('配置保存成功');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingsOutlined />
          AI 设置
        </div>
      }
      style={{ background: '#2d2d44', borderRadius: 12 }}
    >
      {isConfigured && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#52c41a' }}>
          <CheckCircleOutlined />
          AI 配置已完成
        </div>
      )}

      <Form layout="vertical" size="large">
        <Form.Item label="AI 提供商">
          <Select
            value={localConfig.provider}
            onChange={(value) => handleChange('provider', value)}
            style={{ width: '100%', borderRadius: 8 }}
          >
            <Option value="openai">OpenAI / 兼容接口</Option>
            <Option value="ollama">Ollama 本地部署</Option>
            <Option value="webllm">WebLLM 浏览器推理</Option>
          </Select>
        </Form.Item>

        {localConfig.provider === 'openai' && (
          <>
            <Form.Item label="API Key">
              <Input.Password
                value={localConfig.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="请输入 API Key"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>

            <Form.Item label="API 地址">
              <Input
                value={localConfig.baseUrl}
                onChange={(e) => handleChange('baseUrl', e.target.value)}
                placeholder="https://api.openai.com/v1"
                style={{ borderRadius: 8 }}
              />
            </Form.Item>
          </>
        )}

        {localConfig.provider === 'ollama' && (
          <Form.Item label="Ollama 地址">
            <Input
              value={localConfig.baseUrl || 'http://localhost:11434'}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder="http://localhost:11434"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        )}

        <Form.Item label="模型选择">
          <Select
            value={localConfig.model}
            onChange={(value) => handleChange('model', value)}
            style={{ width: '100%', borderRadius: 8 }}
          >
            <Option value="gpt-4o-mini">GPT-4o Mini</Option>
            <Option value="gpt-4o">GPT-4o</Option>
            <Option value="llama3">Llama 3</Option>
            <Option value="qwen2">Qwen 2</Option>
            <Option value="deepseek-chat">DeepSeek</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={saving}
            style={{ width: '100%', borderRadius: 8 }}
          >
            保存配置
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}