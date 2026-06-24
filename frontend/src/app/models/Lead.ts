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
