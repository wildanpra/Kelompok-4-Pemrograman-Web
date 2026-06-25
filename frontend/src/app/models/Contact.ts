export interface Contact {
  id: number;
  customer_id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  created_at?: string;
}

//rsponse dari backend {success, total, data}
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}