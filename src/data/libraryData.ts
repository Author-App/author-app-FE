import assets from "@/assets/images";
import { BookCardProps } from "../types/library/libraryTypes";

export const booksData: BookCardProps[] = [
  {
    id: 1,
    cover: assets.images.bookOfLostNames,
    title: 'The Book of Lost Names',
    author: 'The Book of Lost Names',
    summary: 'A mysterious journey through time and identity that redefines destiny.',
    // format: 'Hardcover',
    // genre: 'Fiction',
    // releaseYear: 2023,
  },
  {
    id: 2,
    cover: assets.images.truly,
    title: 'Truly by Lionel Richie',
    author: 'Lionel Richie',
    summary: 'An emotional adventure of love, loss, and rediscovery across continents.',
    // format: 'Paperback',
    // genre: 'Romance',
    // releaseYear: 2022,
  },
  {
    id: 3,
    cover: assets.images.itEndsWithUs,
    title: 'It Ends With Us',
    author: 'Colleen Hoover',
    summary: 'A thrilling tale of secrets hidden in plain sight within an ancient city.',
    // format: 'Ebook',
    // genre: 'Thriller',
    // releaseYear: 2024,
  },
]