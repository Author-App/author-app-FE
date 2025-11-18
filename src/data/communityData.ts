import assets from "@/assets/images";

export const communityData = [
  {
    id: 1,
    title: "Theories on the Sun King",
    description: "Discuss theories and alternative interpretations of the Sun King’s symbolism.",
    cover: assets.images.community1,
    threads: 12,
    messages: [
      {
        id: 1,
        user: "Alex Johnson",
        avatar: assets.images.personImage1,
        message: "I think the Sun King theory symbolizes enlightenment and control.",
        time: "2h ago",
      },
      {
        id: 2,
        user: "Maria Gonzalez",
        avatar: assets.images.personImage2,
        message: "That’s an interesting take! I believe it represents political power.",
        time: "1h ago",
      },
      {
        id: 3,
        user: "David Kim",
        avatar: assets.images.personImage3,
        message: "Both views are valid — maybe it’s a mix of symbolism and leadership ideals.",
        time: "45m ago",
      },
    ],
  },
  {
    id: 2,
    title: "Tech Innovators Hub",
    description: "A space to share and discuss the latest in technology and innovation.",
    cover: assets.images.community2,
    threads: 8,
    messages: [
      {
        id: 1,
        user: "Sophia Lee",
        avatar: assets.images.personImage1,
        message: "Has anyone tried the new AI collaboration tools? They're amazing!",
        time: "3h ago",
      },
      {
        id: 2,
        user: "Ethan Brown",
        avatar: assets.images.personImage2,
        message: "Yes! The adaptive workflow automation is a game-changer for startups.",
        time: "2h ago",
      },
    ],
  },
  {
    id: 3,
    title: "Women in Business Circle",
    description: "Connecting women leaders and entrepreneurs to share experiences.",
    cover: assets.images.community1,
    threads: 14,
    messages: [
      {
        id: 1,
        user: "Olivia Adams",
        avatar: assets.images.personImage1,
        message: "What’s your best strategy for balancing multiple projects?",
        time: "1d ago",
      },
      {
        id: 2,
        user: "Emma White",
        avatar: assets.images.personImage2,
        message: "I use Notion for task tracking — it keeps me focused and on schedule.",
        time: "22h ago",
      },
    ],
  },
];
