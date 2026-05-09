import http from '../../shared/api/http';
import type { Problem } from '../../shared/types';

export async function getProblems(): Promise<Problem[]> {
  return await http.get('/wiki/problems');
}

export async function getProblem(id: number): Promise<Problem> {
  return await http.get(`/wiki/problems/${id}`);
}

export async function createProblem(data: Omit<Problem, 'id'>): Promise<Problem> {
  return await http.post('/wiki/problems', data);
}

export async function updateProblem(id: number, data: Partial<Problem>): Promise<Problem> {
  return await http.put(`/wiki/problems/${id}`, data);
}

export async function deleteProblem(id: number): Promise<void> {
  return await http.delete(`/wiki/problems/${id}`);
}