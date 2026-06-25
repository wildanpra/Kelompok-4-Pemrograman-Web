export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'staff' | 'sales';
  created_at?: string;
}

//rsponse dari backend {success, total, data}
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}