import http from '../../shared/api/http';
import type { Project } from '../../shared/types';

export async function getProjects(): Promise<Project[]> {
  return await http.get('/projects');
}

export async function getProject(id: number): Promise<Project> {
  return await http.get(`/projects/${id}`);
}

export async function createProject(data: { title: string; problem_id?: number }): Promise<Project> {
  return await http.post('/projects', data);
}

export async function updateProject(id: number, data: Partial<Project>): Promise<Project> {
  return await http.put(`/projects/${id}`, data);
}

export async function deleteProject(id: number): Promise<void> {
  return await http.delete(`/projects/${id}`);
}