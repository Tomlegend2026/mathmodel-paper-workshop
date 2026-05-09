import { useState, useEffect, useMemo } from 'react';
import { Button, Card, Form, Input, Select, message, Tag, Space, Divider, Alert, Typography, Steps, Tooltip } from 'antd';
import { SettingOutlined, SaveOutlined, CheckCircleOutlined, LinkOutlined, ExperimentOutlined, RocketOutlined, ApiOutlined } from '@ant-design/icons';
import { useAIStore } from '../store';
import { AI_PROVIDERS, MODELS_BY_PROVIDER, RECOMMENDED_CONFIGS } from '../config/providers';
import { aiGuideTips, withGuideTip, hasSeenTip, markTipAsSeen } from '../../guide';
import type { AIProvider } from '../types';

const { Option } = Select;
const { Text } = Typography;

export default function AISettingsPanel() {
  const { config, setConfig, isConfigured } = useAIStore();
  const [localConfig, setLocalConfig] = useState(config);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'success' | 'error' | 'idle'>('idle');
  const [currentStep, setCurrentStep] = useState(0);
  
  // 使用 useMemo 缓存提供商和模型列表
  const currentProvider = useMemo(() => 
    AI_PROVIDERS[localConfig.provider as keyof typeof AI_PROVIDERS]
  , [localConfig.provider]);
  
  const availableModels = useMemo(() => 
    MODELS_BY_PROVIDER[localConfig.provider] || []
  , [localConfig.provider]);

  // 当 API Key 变化时，自动测试连接（带防抖）
  useEffect(() => {
    if (localConfig.apiKey && localConfig.apiKey.length > 10 && currentProvider?.requiresApiKey) {
      const timer = setTimeout(() => {
        handleTestConnection();
      }, 1000); // 1秒后自动测试
      return () => clearTimeout(timer);
    }
  }, [localConfig.apiKey, localConfig.provider, currentProvider]);

  const handleSave = () => {
    setSaving(true);
    try {
      setConfig(localConfig);
      message.success('配置保存成功');
      setConnectionStatus('idle');
    } catch (error) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setLocalConfig((prev) => ({ ...prev, [key]: value }));
    // 切换提供商时重置连接状态
    if (key === 'provider') {
      setConnectionStatus('idle');
    }
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus('idle');

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (localConfig.apiKey) {
        headers['Authorization'] = `Bearer ${localConfig.apiKey}`;
      }

      const response = await fetch(`${localConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: localConfig.model,
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10,
        }),
      });

      if (response.ok) {
        setConnectionStatus('success');
        message.success('连接成功！AI 服务可用');
      } else {
        const error = await response.json();
        setConnectionStatus('error');
        message.error(`连接失败：${error.error?.message || response.statusText}`);
      }
    } catch (error: any) {
      setConnectionStatus('error');
      message.error(`连接失败：${error.message || '网络错误'}`);
    } finally {
      setTesting(false);
    }
  };

  const handleQuickConfig = async (quickConfig: typeof RECOMMENDED_CONFIGS[0]) => {
    const provider = AI_PROVIDERS[quickConfig.provider];
    setLocalConfig({
      provider: quickConfig.provider,
      baseUrl: provider.baseUrl,
      model: quickConfig.model,
      apiKey: '',
    });
    
    // 对于不需要 API Key 的提供商，自动测试连接
    if (!provider.requiresApiKey) {
      message.info('正在测试连接...');
      setTesting(true);
      setConnectionStatus('idle');
      
      try {
        const response = await fetch(`${provider.baseUrl}/api/tags`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setConnectionStatus('success');
          message.success('✅ 连接成功！Ollama 服务可用，可以直接使用');
        } else {
          setConnectionStatus('error');
          message.warning('⚠️ Ollama 服务未运行，请先启动 Ollama 服务');
        }
      } catch (error: any) {
        setConnectionStatus('error');
        message.warning('⚠️ 无法连接到 Ollama，请确保已安装并启动 Ollama 服务');
      } finally {
        setTesting(false);
      }
    } else {
      // 需要 API Key 的提供商，提示用户输入
      setConnectionStatus('idle');
      message.info('💡 已自动配置，请填写 API Key 后点击「测试连接」');
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SettingOutlined />
          AI 设置
        </div>
      }
      style={{ background: '#2d2d44', borderRadius: 12, display: 'flex', flexDirection: 'column', height: '100%' }}
      bodyStyle={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}
    >
      {isConfigured && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#52c41a' }}>
          <CheckCircleOutlined />
          AI 配置已完成
        </div>
      )}

      {/* 快速配置推荐 */}
      <Alert
        message="快速开始"
        description="选择一个推荐配置，快速开始使用 AI 功能"
        type="info"
        showIcon
        style={{ marginBottom: 16, background: '#1e3a5f', border: '1px solid #3b82f6' }}
      />
      <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
        {RECOMMENDED_CONFIGS.map((rec) => (
          <Card
            key={rec.provider}
            size="small"
            hoverable
            onClick={() => handleQuickConfig(rec)}
            style={{
              background: localConfig.provider === rec.provider ? '#1e3a5f' : '#2d2d44',
              border: localConfig.provider === rec.provider ? '2px solid #3b82f6' : '1px solid #404060',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong style={{ color: '#fff' }}>{rec.name}</Text>
                <div style={{ fontSize: 12, color: '#a0a0b0', marginTop: 4 }}>{rec.description}</div>
              </div>
              <Tag color={rec.tagColor}>{rec.tag}</Tag>
            </div>
          </Card>
        ))}
      </Space>

      <Divider>自定义配置</Divider>

      <Form layout="vertical" size="large">
        <Form.Item label="选择 AI 服务商">
          {withGuideTip(
            <Select
              value={localConfig.provider}
              onChange={(value) => handleChange('provider', value)}
              style={{ width: '100%', borderRadius: 8 }}
              onFocus={() => markTipAsSeen(aiGuideTips.providerSelect.id)}
            >
              {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
                <Option key={key} value={key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{provider.logo}</span>
                    <span>{provider.name}</span>
                    {!provider.requiresApiKey && (
                      <Tag color="green" style={{ marginLeft: 8 }}>免费</Tag>
                    )}
                  </div>
                </Option>
              ))}
            </Select>,
            aiGuideTips.providerSelect,
            !hasSeenTip(aiGuideTips.providerSelect.id)
          )}
        </Form.Item>

        {currentProvider?.description && (
          <Alert
            message={currentProvider.description}
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {currentProvider?.requiresApiKey && (
          <Form.Item label="API Key" required>
            {withGuideTip(
              <Input.Password
                value={localConfig.apiKey}
                onChange={(e) => handleChange('apiKey', e.target.value)}
                placeholder="请输入 API Key"
                style={{ borderRadius: 8 }}
                onFocus={() => markTipAsSeen(aiGuideTips.apiKeyInput.id)}
              />,
              aiGuideTips.apiKeyInput,
              !hasSeenTip(aiGuideTips.apiKeyInput.id)
            )}
            <Text type="secondary" style={{ fontSize: 12 }}>
              API Key 仅保存在浏览器本地，不会上传到服务器
            </Text>
          </Form.Item>
        )}

        {currentProvider?.requiresBaseUrl && (
          <Form.Item label="API 地址" required>
            <Input
              value={localConfig.baseUrl}
              onChange={(e) => handleChange('baseUrl', e.target.value)}
              placeholder={currentProvider.baseUrl}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
        )}

        <Form.Item label="模型选择" required>
          {withGuideTip(
            <Select
              value={localConfig.model}
              onChange={(value) => handleChange('model', value)}
              style={{ width: '100%', borderRadius: 8 }}
              onFocus={() => markTipAsSeen(aiGuideTips.modelSelect.id)}
            >
              {availableModels.map((model) => (
                <Option key={model.value} value={model.value}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{model.name}</span>
                    <span style={{ fontSize: 12, color: '#a0a0b0' }}>{model.description}</span>
                  </div>
                </Option>
              ))}
            </Select>,
            aiGuideTips.modelSelect,
            !hasSeenTip(aiGuideTips.modelSelect.id)
          )}
        </Form.Item>

        <Form.Item>
          <Space style={{ width: '100%' }}>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handleSave}
              loading={saving}
              style={{ flex: 1, borderRadius: 8 }}
            >
              保存配置
            </Button>
            {withGuideTip(
              <Button
                icon={<ExperimentOutlined />}
                onClick={handleTestConnection}
                loading={testing}
                disabled={!localConfig.apiKey && currentProvider?.requiresApiKey}
                style={{ flex: 1, borderRadius: 8 }}
                onMouseEnter={() => markTipAsSeen(aiGuideTips.testConnection.id)}
              >
                测试连接
              </Button>,
              aiGuideTips.testConnection,
              !hasSeenTip(aiGuideTips.testConnection.id)
            )}
          </Space>
        </Form.Item>

        {connectionStatus === 'success' && (
          <Alert
            message="连接成功"
            description="AI 服务连接正常，可以正常使用"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ marginBottom: 16 }}
          />
        )}

        {connectionStatus === 'error' && (
          <Alert
            message="连接失败"
            description="请检查 API Key 和网络连接后重试"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
      </Form>
    </Card>
  );
}