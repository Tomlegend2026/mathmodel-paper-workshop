import { useState } from 'react';
import { Layout, Menu, Button, Dropdown } from 'antd';
import {
  FileTextOutlined,
  PlusOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  CrownOutlined,
  BookOutlined,
  DatabaseOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../modules/auth';
import { AISettingsPanel } from '../../modules/ai-engine';
import type { MenuProps } from 'antd';

const { Sider, Content, Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const items: MenuItem[] = [
    {
      key: '/projects',
      icon: <FileTextOutlined />,
      label: '我的项目',
    },
    {
      key: '/projects/new',
      icon: <PlusOutlined />,
      label: '新建项目',
    },
    {
      key: '/wiki',
      icon: <BookOutlined />,
      label: '题目库',
    },
    {
      key: '/knowledge',
      icon: <DatabaseOutlined />,
      label: '优秀论文库',
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenu = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'AI 设置',
      onClick: () => setShowSettings(true),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#1e1e2e' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{ background: '#2d2d44', borderRight: '1px solid #444' }}
        width={200}
      >
        <div style={{ padding: '16px', fontSize: 18, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>
          数模论文工坊
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
          style={{ background: 'transparent', borderRight: 'none', marginTop: 16 }}
        />
      </Sider>

      <Layout>
        <Header style={{ background: '#2d2d44', borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
          <div style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            {location.pathname.includes('/steps/1') && '选题与解读'}
            {location.pathname.includes('/steps/2') && '问题分析'}
            {location.pathname.includes('/steps/3') && '建模求解'}
            {location.pathname.includes('/steps/4') && '论文写作'}
            {location.pathname.includes('/steps/5') && '结果优化'}
            {location.pathname === '/projects' && '我的项目'}
            {location.pathname === '/projects/new' && '新建项目'}
            {location.pathname === '/wiki' && '题目库'}
            {location.pathname === '/knowledge' && '优秀论文库'}
          </div>

          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Button style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8 }}>
              <UserOutlined />
              <span>{user?.username}</span>
              <CrownOutlined />
            </Button>
          </Dropdown>
        </Header>

        <Content style={{ padding: 0, background: '#1e1e2e' }}>
          {children}
        </Content>
      </Layout>

      {showSettings && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            right: 24,
            width: 480,
            height: 'calc(100vh - 80px)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <AISettingsPanel />
          </div>
          <Button
            onClick={() => setShowSettings(false)}
            style={{ width: '100%', marginTop: 8, borderRadius: 8 }}
          >
            关闭设置
          </Button>
        </div>
      )}
    </Layout>
  );
}