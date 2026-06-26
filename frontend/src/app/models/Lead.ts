export interface Lead {
  id: number;
  title: string;
  source: string;
  notes: string;
  status: string;
  assigned_to?: number;
  created_at?: string;

  // dari JOIN customers
  customer_id: number;
  customer_name?: string;
  customer_company?: string;

  // dari JOIN users
  assigned_to_name?: string;

  // dari JOIN deals
  deal_id?: number;
  deal_stage?: string;
  deal_value?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  total?: number;
  data: T;
}
