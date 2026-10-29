import { AUTHOR_PROFILE } from '../data/authorData';
import type { AuthorProfile } from '../types/profile.types';

// ponytail: static data, so no loading or error state. Add both when the author API exists.
export const useProfileData = (): { author: AuthorProfile } => ({ author: AUTHOR_PROFILE });
