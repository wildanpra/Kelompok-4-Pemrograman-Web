export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  create_by?: number;
  created_at?: string;
}

//rsponse dari backend {success, total, data}
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}