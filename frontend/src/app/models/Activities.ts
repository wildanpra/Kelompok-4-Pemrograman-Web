export interface Activities {
  id: number;
  customer_id: number;
  type: string;
  description: string;
  activity_date: string;
  created_by: number;
}

//rsponse dari backend {success, total, data}
export interface ApiResponse<T>{
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
