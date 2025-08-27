export interface Task {
  id: number;
  index: number;
  assignee_id: number;
  title: string;
  content: string;
  status_id: number;
  label_id: number[];
}
