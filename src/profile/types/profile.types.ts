export interface SocialLink {
  id: string;
  platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter' | 'website';
  url: string;
  label: string;
}

export interface AuthorProfile {
  id: string;
  name: string;
  title: string;
  image?: string;
  bio: string;
  socialLinks: SocialLink[];
  writingProcess: {
    description: string;
    points: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthorProfileResponse {
  author: AuthorProfile;
}