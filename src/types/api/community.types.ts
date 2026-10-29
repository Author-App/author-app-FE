export interface ThreadResponse {
  id?: string;
  userId: string;
  userName: string;
  userProfileImage?: string;
  message: string;
  // ISO string: this comes straight from JSON
  createdAt: string | null;
}


export interface CommunityResponse {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  threadCount: number;
  isJoined: boolean;
  createdAt: Date | null;
  updatedAt: Date | null;
}


export interface CommunityDetailResponse extends CommunityResponse {
  threads: ThreadResponse[];
}


export interface CreateThreadInput {
  message: string;
}