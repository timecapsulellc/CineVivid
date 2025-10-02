/**
 * CineVivid API Client
 * Comprehensive API service for frontend-backend communication
 */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Types
interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  tier: string;
  credits: number;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
}

interface Video {
  id: number;
  task_id: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  progress: number;
  prompt?: string;
  output_url?: string;
  duration?: number;
  cost_credits?: number;
  created_at: string;
  completed_at?: string;
}

interface TaskStatus {
  task_id: string;
  status: string;
  progress: number;
  result?: string;
  error?: string;
  created_at: string;
  estimated_completion?: string;
}

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  full_name?: string;
}

interface VideoGenerationRequest {
  prompt: string;
  aspect_ratio?: string;
  duration?: number;
  style?: string;
  num_frames?: number;
  guidance_scale?: number;
  enhance_prompt?: boolean;
}

interface PromptEnhancementRequest {
  prompt: string;
  context?: Record<string, any>;
  style?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.clearToken();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    // Load token from localStorage
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('cinevivid_token');
    }
  }

  // Token management
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinevivid_token', token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('cinevivid_token');
    }
    return this.token;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cinevivid_token');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const response = await this.client.post('/auth/login', credentials);
    const { access_token } = response.data;
    this.setToken(access_token);
    return response.data;
  }

  async register(userData: RegisterData): Promise<{ access_token: string; token_type: string; expires_in: number }> {
    const response = await this.client.post('/auth/register', userData);
    const { access_token } = response.data;
    this.setToken(access_token);
    return response.data;
  }

  async logout(): Promise<void> {
    this.clearToken();
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get('/auth/me');
    return response.data;
  }

  async getUserCredits(): Promise<{ credits: number; recent_transactions: any[] }> {
    const response = await this.client.get('/auth/credits');
    return response.data;
  }

  async getUserStats(): Promise<any> {
    const response = await this.client.get('/auth/stats');
    return response.data;
  }

  // Video generation endpoints
  async generateTextToVideo(request: VideoGenerationRequest): Promise<{ task_id: string; status: string; message: string; estimated_time: string; cost: number }> {
    const response = await this.client.post('/generate/text-to-video', request);
    return response.data;
  }

  async generateImageToVideo(formData: FormData): Promise<{ task_id: string; status: string; message: string; estimated_time: string; cost: number }> {
    const response = await this.client.post('/generate/image-to-video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Prompt enhancement
  async enhancePrompt(request: PromptEnhancementRequest): Promise<{
    original_prompt: string;
    enhanced_prompt: string;
    improvement_score: number;
    suggestions: string[];
  }> {
    const response = await this.client.post('/enhance/prompt', request);
    return response.data;
  }

  // Video management
  async getVideos(params?: {
    status?: string;
    page?: number;
    per_page?: number;
  }): Promise<{
    videos: Video[];
    total: number;
    page: number;
    per_page: number;
  }> {
    const response = await this.client.get('/videos', { params });
    return response.data;
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await this.client.get(`/status/${taskId}`);
    return response.data;
  }

  // Health and system info
  async getHealth(): Promise<any> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getSystemInfo(): Promise<any> {
    const response = await this.client.get('/');
    return response.data;
  }

  // Billing endpoints
  async getBillingPlans(): Promise<any> {
    const response = await this.client.get('/billing/plans');
    return response.data;
  }

  async createCheckoutSession(tier: string): Promise<{ session_id: string; url: string }> {
    const response = await this.client.post('/billing/create-checkout-session', { tier });
    return response.data;
  }

  // File operations
  async uploadFile(file: File, endpoint: string = '/upload'): Promise<{
    filename: string;
    file_size: number;
    file_type: string;
    file_url: string;
    upload_id: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.client.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getVideoUrl(path: string): string {
    if (path.startsWith('http')) return path;
    return `${this.baseURL}${path}`;
  }

  // Error handling helper
  handleError(error: AxiosError): string {
    const data = error.response?.data as any;
    if (data?.detail) {
      return data.detail;
    }
    if (data?.message) {
      return data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }

  // Polling utility for long-running tasks
  async pollTaskStatus(
    taskId: string,
    onUpdate?: (status: TaskStatus) => void,
    maxAttempts: number = 60,
    intervalMs: number = 5000
  ): Promise<TaskStatus> {
    let attempts = 0;

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getTaskStatus(taskId);
          
          if (onUpdate) {
            onUpdate(status);
          }

          if (status.status === 'completed') {
            resolve(status);
            return;
          }

          if (status.status === 'failed') {
            reject(new Error(status.error || 'Task failed'));
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            reject(new Error('Task timeout'));
            return;
          }

          setTimeout(poll, intervalMs);
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types for use in components
export type {
  User,
  Video,
  TaskStatus,
  LoginCredentials,
  RegisterData,
  VideoGenerationRequest,
  PromptEnhancementRequest,
  ApiResponse
};

export default apiClient;