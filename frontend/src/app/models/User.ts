export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'sales';
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
