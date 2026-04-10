const db = require('./firebase');

const topics = [
  { text: 'What is your hidden talent?', category: 'Fun', emoji: '🎭' },
  { text: 'What was your first job?', category: 'Career', emoji: '💼' },
  { text: 'If you could travel anywhere, where would you go?', category: 'Travel', emoji: '✈️' },
  { text: 'What is the best book you have read recently?', category: 'Culture', emoji: '📚' },
  { text: 'What is your favourite food?', category: 'Food', emoji: '🍕' },
  { text: 'What do you do to relax after work?', category: 'Lifestyle', emoji: '🧘' },
  { text: 'What is the most interesting project you have worked on?', category: 'Career', emoji: '🚀' },
  { text: 'Do you have any pets?', category: 'Fun', emoji: '🐾' },
  { text: 'What series are you watching right now?', category: 'Culture', emoji: '📺' },
  { text: 'If you could have dinner with anyone, who would it be?', category: 'Fun', emoji: '🍽️' },
  { text: 'What is your unpopular opinion?', category: 'Fun', emoji: '🤔' },
  { text: 'What technology are you most excited about?', category: 'Tech', emoji: '💡' },
  { text: 'What is your favourite music genre or band?', category: 'Culture', emoji: '🎵' },
  { text: 'What is the best advice you have ever received?', category: 'Wisdom', emoji: '🌟' },
  { text: 'Do you prefer working from home or from the office?', category: 'Career', emoji: '🏠' },
  { text: 'What hobby would you like to pick up?', category: 'Lifestyle', emoji: '🎨' },
  { text: 'What superpower would you choose?', category: 'Fun', emoji: '🦸' },
  { text: 'What is the funniest thing that happened to you at work?', category: 'Fun', emoji: '😂' },
];

const people = [
  { name: 'Ana Silva', role: 'Frontend Developer', avatar: '' },
  { name: 'Bruno Costa', role: 'Backend Developer', avatar: '' },
  { name: 'Carla Santos', role: 'UX Designer', avatar: '' },
  { name: 'David Oliveira', role: 'Tech Lead', avatar: '' },
  { name: 'Eva Martins', role: 'QA Engineer', avatar: '' },
  { name: 'Filipe Rocha', role: 'DevOps Engineer', avatar: '' },
];

async function seed() {
  console.log('Seeding database...');

  // Seed topics
  for (const topic of topics) {
    await db.collection('topics').add({
      ...topic,
      createdAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${topics.length} topics`);

  // Seed people
  for (const person of people) {
    await db.collection('people').add({
      ...person,
      createdAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${people.length} people`);

  // Seed two truths one lie
  const truths = [
    {
      personName: 'Ana Silva',
      statements: [
        'I once won a hackathon in 24 hours',
        'I have visited 15 countries',
        'I can solve a Rubik\'s cube in under a minute',
      ],
      lieIndex: 2,
    },
    {
      personName: 'Bruno Costa',
      statements: [
        'I used to be a professional gamer',
        'I have a pilot\'s licence',
        'My first programming language was Assembly',
      ],
      lieIndex: 1,
    },
    {
      personName: 'Carla Santos',
      statements: [
        'I have a twin sibling',
        'I designed a logo for a Fortune 500 company',
        'I once met Elon Musk at a conference',
      ],
      lieIndex: 0,
    },
    {
      personName: 'David Oliveira',
      statements: [
        'I wrote my first line of code at age 8',
        'I ran a marathon last year',
        'I have never eaten sushi',
      ],
      lieIndex: 1,
    },
  ];

  for (const truth of truths) {
    await db.collection('truths').add({
      ...truth,
      createdAt: new Date().toISOString(),
    });
  }
  console.log(`Seeded ${truths.length} two-truths sets`);

  console.log('Done!');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
