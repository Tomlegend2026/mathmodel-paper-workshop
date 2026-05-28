import { createBrowserRouter } from 'react-router-dom';
import { LoginPage, AuthGuard } from '../modules/auth';
import { ProjectListPage, NewProjectPage } from '../modules/project';
import { Step1Page, Step2Page, Step3Page, Step4Page, Step5Page } from '../modules/steps';
import MainLayout from './layout/MainLayout';
import WikiPage from '../modules/wiki/pages/WikiPage';
import KnowledgePage from '../modules/knowledge/pages/KnowledgePage';
import { PaperReviewPage } from '../modules/review';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout>
          <ProjectListPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects',
    element: (
      <AuthGuard>
        <MainLayout>
          <ProjectListPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/new',
    element: (
      <AuthGuard>
        <MainLayout>
          <NewProjectPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/:projectId/steps/1',
    element: (
      <AuthGuard>
        <MainLayout>
          <Step1Page />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/:projectId/steps/2',
    element: (
      <AuthGuard>
        <MainLayout>
          <Step2Page />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/:projectId/steps/3',
    element: (
      <AuthGuard>
        <MainLayout>
          <Step3Page />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/:projectId/steps/4',
    element: (
      <AuthGuard>
        <MainLayout>
          <Step4Page />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/projects/:projectId/steps/5',
    element: (
      <AuthGuard>
        <MainLayout>
          <Step5Page />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/wiki',
    element: (
      <AuthGuard>
        <MainLayout>
          <WikiPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/knowledge',
    element: (
      <AuthGuard>
        <MainLayout>
          <KnowledgePage />
        </MainLayout>
      </AuthGuard>
    ),
  },
  {
    path: '/review',
    element: (
      <AuthGuard>
        <MainLayout>
          <PaperReviewPage />
        </MainLayout>
      </AuthGuard>
    ),
  },
]);