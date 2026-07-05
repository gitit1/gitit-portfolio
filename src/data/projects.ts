export type Project = {
  name: string;
  useLogoAsName?: boolean;
  link: string;
  gitLink?: string;
  images: number;
  imagesName: string;
  imagesType: string;
  description: string[];
  features: string[];
  technologies: string[];
  tags?: [string, string][];
  other?: [string, string][];
};

export const projects: Project[] = [
  {
    name: 'MFL',
    useLogoAsName: false,
    link: 'http://www.myfanficslibrary.com',
    gitLink: 'https://github.com/gitit1/my-fanfic-library',
    images: 16,
    imagesName: 'mfl',
    imagesType: 'JPG',
    description: [
      'This is My biggest personal projects. I am a huge reader of fanfics and the current sites are lacking.',
      'The idea behind is to be able to save all my favorites fandoms fanfics so I have a backup in case it got deleted.',
      "The second goal is to know what I already read while browsing on site, which doesn't exist on the big sites.",
      'The third goal is that all the data of the fanfics will be in one place so I will not have to search in 3 different sites.',
      'So I scraped the 3 biggest Fanfics sites (AO3, FF, Wattpad) and built my own platform to use the data.',
    ],
    features: [
      'Scraping and Merging massive amount of data',
      'Users System',
      'DB - filter/sort/CRUD',
      'Manager area build with socket to control the downloader in server',
      'Authentication System',
      'Email System',
      'And Much More...',
    ],
    technologies: ['Client - React', 'Server - Node JS', 'DB: MongoDB'],
    tags: [
      ['Big Project', 'red'],
      ['React', 'pink'],
      ['NodeJS', 'blue'],
    ],
  },
  {
    name: 'TriPick',
    useLogoAsName: true,
    link: 'http://tripick.gititregev.info',
    images: 8,
    imagesName: 'tripick',
    imagesType: 'png',
    description: [
      'This site was my final project for my information system degree. The site won as one of the best 10 projects.',
      'The idea behind this project is helping travelers finding partners for a shared whole trip or just some part of the trip.',
      'You can also get information about the countries and what other travelers are recommending doing in those countries and best activities/sights.',
    ],
    features: [
      'Search/Filter and Sort the DB',
      'Rating Data System',
      'Users System',
      'Ability to Send & Receive Messages Between Users',
      'Facebook API',
      'Email System',
    ],
    technologies: ['HTML 5', 'Javascript', 'Jquery', 'CSS', 'PHP', 'MySQL'],
    tags: [['Big Project', 'red']],
    other: [
      ['http://tripick.gititregev.info/files/technical.pdf', 'Technical Poster'],
      ['http://tripick.gititregev.info/files/market.pdf', 'Market Poster'],
      ['http://tripick.gititregev.info/files/TripickFinal.pptx', 'Project Power Point'],
      ['http://tripick.gititregev.info/files/top10.mp4', 'Top 10 video (explain about the system)'],
    ],
  },
  {
    name: 'Chat Room',
    useLogoAsName: false,
    link: 'http://git_chat_room.gititregev.info/',
    gitLink: 'https://github.com/gitit1/gits_chat_room',
    imagesName: 'chat_room',
    images: 6,
    imagesType: 'JPG',
    description: [
      'Build a React based chat app. The app contains a registration page and a chat page.',
      'Full description for the rules of the application is on the GitHub readme file.',
    ],
    features: ['Ability to Send & Receive Messages Between Users', 'Authentication System'],
    technologies: ['React', 'Node JS', 'Web Socket'],
    tags: [
      ['Small Project', 'purple'],
      ['React', 'pink'],
      ['NodeJS', 'blue'],
    ],
  },
];
