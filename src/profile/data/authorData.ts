import type { AuthorProfile } from '../types/profile.types';

export const AUTHOR_PROFILE: AuthorProfile = {
  id: 'stanley-paden',
  name: 'Stanley Paden',
  title: 'Author & Educator',
  image: undefined, // Will use local asset
  bio: `From the diverse terrains of Needham, Massachusetts, to the bustling streets of New York City and the tranquil farms of the Midwest, Stanley Paden's life has been a journey of extensive learning and observation. A dedicated educator who has taught English in the Czech Republic and China, Stanley's love for languages extends to conversational fluency in Spanish and Czech, alongside a basic knowledge of several others. This global immersion, coupled with his understanding of farm life and a keen interest in organic farming, provides a rich foundation for his literary work.`,
  socialLinks: [
    {
      id: 'linkedin',
      platform: 'linkedin',
      url: 'https://www.linkedin.com/company/stanley-paden-author/',
      label: 'LinkedIn',
    },
    {
      id: 'instagram',
      platform: 'instagram',
      url: 'https://www.instagram.com/stanleypadenofficial/',
      label: 'Instagram',
    },
    {
      id: 'facebook',
      platform: 'facebook',
      url: 'https://www.facebook.com/StanleyPadenOfficial/',
      label: 'Facebook',
    },
  ],
  writingProcess: {
    description: `Stanley Paden approaches writing with a meticulous blend of research, imagination, and observation. Every story begins with a spark of inspiration drawn from his experiences, travels, and interactions with people across cultures.`,
    points: [
      'Begins with inspiration from life experiences and travels',
      'Focuses on authentic world-building and emotional depth of characters',
      'Structured writing sessions: drafting, research, and editing',
      'Revises multiple times to ensure clarity, rhythm, and narrative flow',
      'Draws ideas from everyday life, interactions, and global experiences',
    ],
  },
};
