export interface User {
  id: number;
  username: string;
  email: string;
  school?: string;
  created_at: string;
  updated_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
  user_id: number;
}

export interface Project {
  id: number;
  user_id: number;
  title: string;
  problem_id?: number;
  status: 'created' | 'in_progress' | 'completed';
  current_step: number;
  step_progress: Record<number, number>;
  step_data: StepData;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Problem {
  id: number;
  year: number;
  competition: string;
  title: string;
  category: string;
  content: string;
  tags: string[];
  difficulty: number;
}

export interface AIConfig {
  provider: 'openai' | 'ollama' | 'webllm';
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export interface StepData {
  step1?: {
    problem_title: string;
    problem_content: string;
    problem_analysis: string;
    keywords: string[];
  };
  step2?: {
    objectives: string[];
    constraints: string[];
    assumptions: string[];
  };
  step3?: {
    model_type: string;
    model_description: string;
    equations: string;
    code: string;
  };
  step4?: {
    sections: Record<string, string>;
    references: string[];
  };
  step5?: {
    results: string;
    analysis: string;
    improvements: string[];
  };
}