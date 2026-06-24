export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  created_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
