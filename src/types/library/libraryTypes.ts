export interface BookCardProps {
  id: number
  cover: string
  title: string
  author: string
  summary: string
  totalMinutes: number
  minutesCompleted: number
  percentage: number
}


export interface AudiobookCardProps {
  id: number
  cover: string
  title: string
  narrator: string
  duration: string
}

// API response book type (from /books endpoint)
export interface LibraryBook {
  id: number | string
  title: string
  author: string
  thumbnail: string
  isFree: boolean
  hasAccess: boolean
}

