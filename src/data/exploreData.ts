import assets from "@/assets/images";

export const exploreData = [
    {
        type: "carousel",
        id: "blog",
        title: "Latest Blogs",
        subtype: "blog",
        data: [
            {
                id: 1,
                title: "The Rise of AI in Everyday Life",
                author: "Sophia Turner",
                date: "October 25, 2023",
                readTime: "6 min",
                avatar: assets.images.personImage1,
                cover: assets.images.blogImage1,
                content: `
      <h2>How Artificial Intelligence is Reshaping Our Daily Routines</h2>
      <p>
        Artificial Intelligence (AI) has become an integral part of our everyday lives — 
        from the virtual assistants that help us manage our schedules to the smart algorithms 
        curating what we watch, read, and buy. 
      </p>
      <p>
        The convenience brought by AI-driven applications is undeniable, yet it also 
        raises critical questions about privacy, data ownership, and automation.
      </p>
      <h3>Where We See AI Today</h3>
      <ul>
        <li>Personalized recommendations in streaming platforms</li>
        <li>Smart home automation and voice assistants</li>
        <li>AI-powered healthcare diagnostics</li>
      </ul>
      <p>
        As technology continues to evolve, striking a balance between innovation and ethics 
        remains key. The future is bright — but also needs careful human oversight.
      </p>
    `,
            },
            {
                id: 2,
                title: "Designing for the Future: Human-Centered Tech",
                author: "Liam Carter",
                date: "November 2, 2023",
                readTime: "5 min",
                avatar: assets.images.personImage2,
                cover: assets.images.blogImage2,
                content: `
      <h2>Creating Technology That Puts People First</h2>
      <p>
        Great design doesn’t just look good — it solves problems. 
        Human-centered design ensures that innovation stays grounded in empathy, 
        accessibility, and user well-being.
      </p>
      <p>
        As digital products become increasingly complex, designers must consider 
        how interfaces, workflows, and AI systems affect real human behavior.
      </p>
      <h3>Core Principles of Human-Centered Design</h3>
      <ol>
        <li>Empathy for the end-user</li>
        <li>Accessibility and inclusivity</li>
        <li>Iterative feedback and testing</li>
      </ol>
      <p>
        By putting humans at the heart of innovation, we create technology that truly enhances life — not complicates it.
      </p>
    `,
            },
            {
                id: 3,
                title: "Sustainability in Modern Business",
                author: "Isabella Green",
                date: "November 9, 2023",
                readTime: "7 min",
                avatar: assets.images.personImage3,
                cover: assets.images.blogImage3,
                content: `
      <h2>How Companies Are Adapting to a Greener Future</h2>
      <p>
        The global shift toward sustainability has transformed how businesses operate. 
        From reducing carbon emissions to adopting renewable energy, companies are 
        reimagining what it means to be successful in the 21st century.
      </p>
      <p>
        Consumers today demand transparency and accountability — and businesses that 
        embrace sustainability not only help the planet but also gain stronger brand loyalty.
      </p>
      <h3>Leading the Change</h3>
      <p>
        Innovative brands are setting new standards by integrating sustainability into 
        their core mission rather than treating it as an afterthought.
      </p>
    `,
            }
        ],
    },
    {
        type: "carousel",
        id: "podcasts",
        title: "Top Podcasts",
        subtype: "podcasts",
        data: [
            {
                id: 1,
                cover: assets.images.articleImage1,
                title: "Voices of Innovation",
                description:
                    "Discussing the legacy of ancient empires and their influence on modern society",
                duration: "32 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                id: 2,
                cover: assets.images.articleImage2,
                title: "Design Talks",
                description:
                    "Exploring creative design principles and trends shaping our future",
                duration: "45 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            },
            {
                id: 3,
                cover: assets.images.articleImage3,
                title: "Business Unfolded",
                description:
                    "Real stories and insights from global entrepreneurs and innovators",
                duration: "28 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                id: 4,
                cover: assets.images.articleImage4,
                title: "Tech Reimagined",
                description:
                    "A deep dive into the latest technology breakthroughs and industry leaders",
                duration: "40 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                id: 5,
                cover: assets.images.articleImage5,
                title: "Mindful Minutes",
                description:
                    "Conversations about mindfulness, productivity, and mental wellness",
                duration: "35 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            },
            {
                id: 6,
                cover: assets.images.articleImage2,
                title: "Startup Stories",
                description:
                    "Founders share lessons learned while building their dream businesses",
                duration: "50 min",
                audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            },
        ],
    },
    {
        type: "carousel",
        id: "videos",
        title: "Featured Videos",
        subtype: "videos",
        data: [
            {
                id: 1,
                cover: assets.images.blogImage1,
                title: "Building a Smart City",
                duration: "00:07",
                video: null,
                description:
                    "Discover how technology, data, and sustainable planning come together to shape the cities of tomorrow. Explore the innovations driving smart urban development."
            },
            {
                id: 2,
                cover: assets.images.blogImage2,
                title: "Behind the Scenes: AI Robotics",
                duration: "00:15",
                video: null,
                description:
                    "Take a closer look at how artificial intelligence powers modern robotics. From automation to emotion recognition, see what’s next in robotics innovation."
            },
            {
                id: 3,
                cover: assets.images.blogImage3,
                title: "The Future of Mobility",
                duration: "10:10",
                video: null,
                description:
                    "A deep dive into the technologies transforming how we move — electric vehicles, hyperloops, and autonomous transport systems redefining global mobility."
            },

            {
                id: 4,
                cover: assets.images.blogImage1,
                title: "Behind the Scenes: AI Robotics",
                duration: "09:22",
                video: null,
                description:
                    "Learn about the latest breakthroughs in AI-driven robotics and how they’re revolutionizing industries from healthcare to manufacturing."

            },
        ],
    },
    {
        type: "carousel",
        id: "events",
        title: "Upcoming Events",
        subtype: "events",
        data: [
            {
                id: 1,
                cover: assets.images.blogImage1,
                title: "Tech World Expo 2023",
                date: "November 18, 2023",
                time: '5:00 PM - 6:00 PM',
                location: "San Francisco, CA",
                type: 'Offline',
                about:
                    "The Tech World Expo 2023 is the leading event for innovators, engineers, and entrepreneurs shaping the future of technology. Attendees will explore advancements in artificial intelligence, robotics, and sustainability. Expect live demos, panel discussions, and networking sessions with industry experts and investors.",
            },
            {
                id: 2,
                cover: assets.images.blogImage2,
                title: "Digital Future Summit",
                date: "December 10, 2023",
                time: '5:00 PM - 6:00 PM',
                location: "Berlin, Germany",
                type: 'Offline',
                about:
                    "The Digital Future Summit unites global leaders in business, technology, and design to discuss the digital transformation of industries. The event includes talks, workshops, and networking sessions focused on AI, blockchain, and digital innovation shaping the next decade.",
            },
            {
                id: 3,
                cover: assets.images.blogImage3,
                title: "Startup Growth Meetup",
                date: "January 22, 2024",
                time: '5:00 PM - 6:00 PM',
                location: "Online",
                type: 'Online',
                about:
                    "The Startup Growth Meetup 2024 is an online event designed for founders and entrepreneurs looking to scale their startups. Learn strategies for funding, growth marketing, and product development from experienced startup mentors and investors.",
            },
        ],
    },
    {
        type: "carousel",
        id: "community",
        title: "Community Highlights",
        subtype: "community",
        data: [
            {
                id: 1,
                cover: assets.images.community1,
                title: "Theories on the Sun King",
                threads: 12,
                description: 'Discuss theories and alternative interpretations'
            },
            {
                id: 2,
                cover: assets.images.community2,
                title: "Tech Innovators Hub",
                threads: 8,
                description: 'Discuss theories and alternative interpretations'
            },
            {
                id: 3,
                cover: assets.images.community1,
                title: "Women in Business Circle",
                threads: 14,
                description: 'Discuss theories and alternative interpretations'
            },
        ],
    },
];
