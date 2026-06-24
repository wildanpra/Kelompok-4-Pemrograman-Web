export interface Deal {
  id: number;
  lead_id: number;
  title: string;
  value: number;
  stage: string;
  closed_at?: string;
  created_at: string;
}
