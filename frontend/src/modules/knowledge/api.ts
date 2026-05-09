import http from '../../shared/api/http';

export interface PaperKnowledge {
  id: number;
  title: string;
  year: number;
  competition: string;
  problem_type?: string;
  category?: string;
  difficulty?: number;
  pdf_path?: string;
  docx_path?: string;
  code_path?: string;
  data_path?: string;
  abstract?: string;
  summary?: string;
  methods_used: string[];
  models_used: string[];
  key_points: Record<string, any>;
  tags: string[];
  award_level?: string;
  source?: string;
  search_keywords?: string;
  created_at?: string;
}

export interface PaperSearchRequest {
  query: string;
  competition?: string;
  year?: number;
  category?: string;
  methods?: string[];
  top_k?: number;
  use_semantic?: boolean;
  use_keyword?: boolean;
}

export interface PaperSearchResponse {
  papers: PaperKnowledge[];
  total: number;
  query: string;
  search_method: string;
}

// 获取论文列表
export async function getPapers(params?: {
  competition?: string;
  year?: number;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<PaperKnowledge[]> {
  const queryParams = new URLSearchParams();
  if (params?.competition) queryParams.append('competition', params.competition);
  if (params?.year) queryParams.append('year', params.year.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  
  const query = queryParams.toString();
  return await http.get(`/knowledge/papers${query ? '?' + query : ''}`);
}

// 获取单篇论文
export async function getPaper(id: number): Promise<PaperKnowledge> {
  return await http.get(`/knowledge/papers/${id}`);
}

// 创建论文
export async function createPaper(data: Omit<PaperKnowledge, 'id' | 'created_at'>): Promise<PaperKnowledge> {
  return await http.post('/knowledge/papers', data);
}

// 更新论文
export async function updatePaper(id: number, data: Partial<PaperKnowledge>): Promise<PaperKnowledge> {
  return await http.put(`/knowledge/papers/${id}`, data);
}

// 删除论文
export async function deletePaper(id: number): Promise<void> {
  return await http.delete(`/knowledge/papers/${id}`);
}

// 检索论文
export async function searchPapers(request: PaperSearchRequest): Promise<PaperSearchResponse> {
  return await http.post('/knowledge/search', request);
}

// 下载论文文件
export async function downloadPaper(paperId: number, fileType: 'pdf' | 'word'): Promise<void> {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(
    `${import.meta.env.VITE_API_URL || '/api'}/knowledge/papers/${paperId}/download/${fileType}`,
    { method: 'GET', headers }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || '下载失败');
  }
  
  // 获取文件名
  const contentDisposition = response.headers.get('content-disposition');
  let filename = `paper.${fileType === 'pdf' ? 'pdf' : 'docx'}`;
  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/i);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }
  
  // 创建blob并下载
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
