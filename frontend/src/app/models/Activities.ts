export interface Activities {
  id: number;
  customer_id: number;
  type: string;
  description: string;
  activity_date: string;
  created_by: number;
  customer_name?: string;
  created_by_name?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
