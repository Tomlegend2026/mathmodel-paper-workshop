import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { router } from './app/routes';
import './index.css';

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          colorBgBase: '#1e1e2e',
          colorTextBase: '#d4d4d8',
          colorBgContainer: '#2d2d44',
          colorBgElevated: '#2d2d44',
          colorBorder: '#444',
          borderRadius: 8,
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
}