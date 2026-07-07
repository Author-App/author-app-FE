export interface CreateBugReportRequest {
  title: string;
  description: string;
}

export interface BugReportResponse {
  id: string;
  userId: string;
  title: string;
  description: string;
  image?: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
