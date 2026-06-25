export interface Lead {
  id: number;
  customer_id: number;
  title: string;
  source: string;
  notes: string;
  status: string;
  assigned_to: number;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  total?: number;
  data: T;
}
