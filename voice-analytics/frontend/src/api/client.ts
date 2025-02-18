const API_BASE_URL = 'http://localhost:3001/api';

interface ApiResponse<T> {
  data: T;
  error?: string;
}

interface Metrics {
  totalCalls: number;
  totalMinutes: number;
  answeredCalls: number;
  noAnswers: number;
  didNotConnect: number;
  transfers: number;
  appointments: number;
  totalSpent: number;
}

interface PerformanceData {
  date: string;
  totalSpent: number;
  appointments: number;
}

interface CallData {
  call_id: string;
  receivedAt: string;
  duration: number;
  status: string;
  answered: boolean;
  transferred: boolean;
  appointment_scheduled: boolean;
  user_sentiment: string;
  call_summary: string;
  recording_url?: string;
  full_transcript?: string;
  agent_id?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  const data = await response.json();
  return { data };
}

export const api = {
  async getMetrics(pricePerMinute: number): Promise<ApiResponse<Metrics>> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics?pricePerMinute=${pricePerMinute}`);
      return handleResponse<Metrics>(response);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  async getPerformanceData(pricePerMinute: number): Promise<ApiResponse<PerformanceData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics/performance?pricePerMinute=${pricePerMinute}`);
      return handleResponse<PerformanceData[]>(response);
    } catch (error) {
      console.error('Error fetching performance data:', error);
      throw error;
    }
  },

  async getCalls(pricePerMinute: number): Promise<ApiResponse<CallData[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/calls?pricePerMinute=${pricePerMinute}`);
      return handleResponse<CallData[]>(response);
    } catch (error) {
      console.error('Error fetching calls:', error);
      throw error;
    }
  }
}; 