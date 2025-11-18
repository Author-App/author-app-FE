import assets from "@/assets/images";
import { BookCardProps } from "../types/library/libraryTypes";

export const libraryData = [
  {
    id: 1,
    cover: assets.images.articleImage1,
    title: 'The Desert Kings Heir',
    author: 'Stanley Padden',
    isLocked: false,
  },
  {
    id: 2,
    cover: assets.images.articleImage2,
    title: 'Crusaders Oath',
    author: 'Stanley Padden',
    isLocked: true,
  },
  {
    id: 3,
    cover: assets.images.articleImage3,
    title: 'Whispers Great Wall',
    author: 'Stanley Padden',
    isLocked: false,
  },
  {
    id: 4,
    cover: assets.images.articleImage4,
    title: 'Kens Oath',
    author: 'Stanley Padden',
    isLocked: true,
  },
  {
    id: 5,
    cover: assets.images.articleImage5,
    title: 'Beent Sun',
    author: 'Stanley Padden',
    isLocked: false,
  },
]

export const booksData: BookCardProps[] = [
  {
    id: 1,
    cover: assets.images.bookbanner,
    title: 'The Book of Lost Names',
    author: 'The Book of Lost Names',
    summary: 'A mysterious journey through time and identity that redefines destiny.',
    totalMinutes: 50,
    minutesCompleted: 20,
    percentage: (20 / 50) * 100,
  },
  {
    id: 2,
    cover: assets.images.truly,
    title: 'Truly by Lionel Richie',
    author: 'Lionel Richie',
    summary: 'An emotional adventure of love, loss, and rediscovery across continents.',
    totalMinutes: 45,
    minutesCompleted: 15,
    percentage: (15 / 45) * 100,
  },
  {
    id: 3,
    cover: assets.images.itEndsWithUs,
    title: 'It Ends With Us',
    author: 'Colleen Hoover',
    summary: 'A thrilling tale of secrets hidden in plain sight within an ancient city.',
    totalMinutes: 55,
    minutesCompleted: 30,
    percentage: (30 / 55) * 100,
  },
];


export const audiobooksData: BookCardProps[] = [
  {
    id: 1,
    cover: assets.images.bookbanner,
    title: 'Where the Crawdads Sing',
    author: 'Cassandra Campbell',
    summary: 'A mysterious journey through time and identity that redefines destiny.',
    totalMinutes: 50,
    minutesCompleted: 20,
    percentage: (20 / 50) * 100,
  },
  {
    id: 2,
    cover: assets.images.theSilentPatient,
    title: 'The Silent Patient',
    author: 'Jack Hawkins',
    summary: 'An emotional adventure of love, loss, and rediscovery across continents.',
    totalMinutes: 45,
    minutesCompleted: 15,
    percentage: (15 / 45) * 100,
  },
  {
    id: 3,
    cover: assets.images.midnightLibrary,
    title: 'The Midnight Library',
    author: 'Carey Mulligan',
    summary: 'A thrilling tale of secrets hidden in plain sight within an ancient city.',
    totalMinutes: 55,
    minutesCompleted: 30,
    percentage: (30 / 55) * 100,
  },
];