import assets from "@/assets/images";
import { HomeItem } from "../types/home/homeTypes";

export const homeData: HomeItem[] = [
  // {
  //   type: 'hero',
  //   id: 'hero_1',
  //   subtype: "book",
  // },
  {
    type: 'carousel',
    id: 'trending_books',
    title: 'Trending Books',
    subtype: 'books',
    data: [
      {
        id: 1,
        cover: assets.images.SecretstheSilkRoad,
        title: 'Secrets the Silk Road',
        author: 'The Book of Lost Names',
      },
      {
        id: 2,
        cover: assets.images.CommunityForums,
        title: 'Podcast: Echoes the Empire',
        author: 'Lionel Richie',
      },
      {
        id: 3,
        cover: assets.images.CommunityForums,
        title: 'Community Forums',
        author: 'Colleen Hoover',
      },
    ],
  },
  {
    type: 'carousel',
    id: 'articles',
    title: 'Featured Articles',
    subtype: 'articles',
    data: [
      {
        id: 1,
        cover: assets.images.articleImage1,
        title: 'Pelt Cion',
        author: 'The Book of Lost Names',
      },
      {
        id: 2,
        cover: assets.images.articleImage2,
        title: 'Rerra Hiars',
        author: 'Lionel Richie',
      },
      {
        id: 3,
        cover: assets.images.articleImage3,
        title: 'Corke Hinge',
        author: 'Colleen Hoover',
      },
      {
        id: 4,
        cover: assets.images.articleImage4,
        title: 'Lionel Richie',
        author: 'Colleen Hoover',
      },
      {
        id: 5,
        cover: assets.images.articleImage5,
        title: 'Rerra Hiars',
        author: 'Colleen Hoover',
      },

    ],
  },
  {
    type: 'carousel',
    id: 'new_audiobooks',
    title: 'New Audiobooks',
    subtype: 'audiobooks',
    data: [
      {
        id: 1,
        cover: assets.images.SecretstheSilkRoad,
        title: 'Secrets the Silk Road',
        author: 'The Book of Lost Names',
      },
      {
        id: 2,
        cover: assets.images.CommunityForums,
        title: 'Podcast: Echoes the Empire',
        author: 'Lionel Richie',
      },
      {
        id: 3,
        cover: assets.images.CommunityForums,
        title: 'Community Forums',
        author: 'Colleen Hoover',
      },
      // {
      //   id: 1,
      //   cover: assets.images.bookbanner,
      //   title: 'Where the Crawdads Sing',
      //   narrator: 'Cassandra Campbell',
      //   duration: '12 hr 15 min',
      // },
      // {
      //   id: 2,
      //   cover: assets.images.theSilentPatient,
      //   title: 'The Silent Patient',
      //   narrator: 'Jack Hawkins',
      //   duration: '9 hr 5 min',
      // },
      // {
      //   id: 3,
      //   cover: assets.images.midnightLibrary,
      //   title: 'The Midnight Library',
      //   narrator: 'Carey Mulligan',
      //   duration: '8 hr 50 min',
      // },
    ],
  },
]
