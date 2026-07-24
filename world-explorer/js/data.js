// js/data.js
export const COUNTRY_DATA = {
  "France": { emoji: "🇫🇷", capital: "Paris", pop: "68 million", curr: "Euro", cont: "Europe", lang: "French", anim: "Gallic Rooster", fact: "The Louvre in Paris is the world's most visited art museum.", x: 52, y: 30 },
  "Japan": { emoji: "🇯🇵", capital: "Tokyo", pop: "125 million", curr: "Yen", cont: "Asia", lang: "Japanese", anim: "Green Pheasant", fact: "Japan consists of over 6,800 islands.", x: 88, y: 35 },
  "Germany": { emoji: "🇩🇪", capital: "Berlin", pop: "83 million", curr: "Euro", cont: "Europe", lang: "German", anim: "Federal Eagle", fact: "Germany shares borders with nine other countries.", x: 54, y: 28 },
  "Australia": { emoji: "🇦🇺", capital: "Canberra", pop: "26 million", curr: "Australian Dollar", cont: "Oceania", lang: "English", anim: "Kangaroo", fact: "It is the only continent covered by a single country.", x: 85, y: 75 },
  "Canada": { emoji: "🇨🇦", capital: "Ottawa", pop: "40 million", curr: "Canadian Dollar", cont: "North America", lang: "English, French", anim: "Beaver", fact: "Canada has more lakes than the rest of the world combined.", x: 22, y: 22 },
  "Brazil": { emoji: "🇧🇷", capital: "Brasília", pop: "214 million", curr: "Real", cont: "South America", lang: "Portuguese", anim: "Jaguar", fact: "The Amazon River pushes so much water it dilutes the ocean's saltiness for miles.", x: 32, y: 65 },
  "Italy": { emoji: "🇮🇹", capital: "Rome", pop: "59 million", curr: "Euro", cont: "Europe", lang: "Italian", anim: "Italian Wolf", fact: "Italy has a free public wine fountain in Caldari di Ortona.", x: 55, y: 34 },
  "Spain": { emoji: "🇪🇸", capital: "Madrid", pop: "47 million", curr: "Euro", cont: "Europe", lang: "Spanish", anim: "Bull", fact: "Spain produces over half of the world's olive oil.", x: 50, y: 36 },
  "United States": { emoji: "🇺🇸", capital: "Washington D.C.", pop: "331 million", curr: "US Dollar", cont: "North America", lang: "English", anim: "Bald Eagle", fact: "The US has the largest economy in the world.", x: 22, y: 35 },
  "China": { emoji: "🇨🇳", capital: "Beijing", pop: "1.4 billion", curr: "Yuan", cont: "Asia", lang: "Mandarin", anim: "Giant Panda", fact: "The Great Wall is over 13,000 miles long.", x: 78, y: 38 },
  "India": { emoji: "🇮🇳", capital: "New Delhi", pop: "1.4 billion", curr: "Indian Rupee", cont: "Asia", lang: "Hindi, English", anim: "Bengal Tiger", fact: "India has a floating post office on Dal Lake in Srinagar.", x: 72, y: 45 },
  "Egypt": { emoji: "🇪🇬", capital: "Cairo", pop: "109 million", curr: "Egyptian Pound", cont: "Africa", lang: "Arabic", anim: "Steppe Eagle", fact: "The Great Pyramid of Giza is the oldest of the Seven Wonders.", x: 58, y: 45 },
  "Mexico": { emoji: "🇲🇽", capital: "Mexico City", pop: "126 million", curr: "Mexican Peso", cont: "North America", lang: "Spanish", anim: "Golden Eagle", fact: "Mexico City is sinking by about 10 inches a year.", x: 20, y: 46 }
};

export const QUESTIONS = [
  { id:1, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of France?', options:['Paris','London','Berlin','Madrid'], correct:0, country: 'France' },
  { id:2, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of Japan?', options:['Osaka','Kyoto','Tokyo','Hiroshima'], correct:2, country: 'Japan' },
  { id:3, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of Germany?', options:['Munich','Frankfurt','Hamburg','Berlin'], correct:3, country: 'Germany' },
  { id:4, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of Australia?', options:['Sydney','Melbourne','Brisbane','Canberra'], correct:3, country: 'Australia' },
  { id:5, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of Canada?', options:['Toronto','Vancouver','Ottawa','Montréal'], correct:2, country: 'Canada' },
  { id:6, category:'capitals', emoji:'🏛️', difficulty:'easy', question:'What is the capital of Brazil?', options:['São Paulo','Rio de Janeiro','Brasília','Salvador'], correct:2, country: 'Brazil' },
  { id:24, category:'flags', emoji:'🏴', difficulty:'easy', question:'Which country does the flag 🇺🇸 belong to?', options:['United Kingdom','United States','Australia','New Zealand'], correct:1, country: 'United States' },
  { id:25, category:'flags', emoji:'🏴', difficulty:'easy', question:'Which country does the flag 🇯🇵 belong to?', options:['China','South Korea','Taiwan','Japan'], correct:3, country: 'Japan' },
  { id:40, category:'population', emoji:'👥', difficulty:'easy', question:'As of 2023, which country surpassed China as the most populous?', options:['Bangladesh','Pakistan','Indonesia','India'], correct:3, country: 'India' },
  { id:52, category:'currency', emoji:'💰', difficulty:'easy', question:'What currency is used in Japan?', options:['Yuan','Won','Baht','Yen'], correct:3, country: 'Japan' },
  { id:67, category:'continents', emoji:'🌍', difficulty:'easy', question:'On which continent is Egypt located?', options:['Asia','Europe','Africa','South America'], correct:2, country: 'Egypt' },
  { id:11, category:'capitals', emoji:'🏛️', difficulty:'medium', question:'What is the capital of Mexico?', options:['Guadalajara','Monterrey','Mexico City','Puebla'], correct:2, country: 'Mexico'}
];

export const ACHIEVEMENTS = [
  { id: 'cart_app', icon: '🧭', name: 'Cartography Apprentice', desc: 'Completed your first expedition', check: (s) => s.gamesPlayed >= 1 },
  { id: 'world_exp', icon: '🌍', name: 'World Explorer', desc: 'Scored 50%+ accuracy on a route', check: (s, r) => r && r.accuracy >= 50 },
  { id: 'freq_trav', icon: '✈️', name: 'Frequent Traveler', desc: 'Scored 70%+ accuracy on a route', check: (s, r) => r && r.accuracy >= 70 },
  { id: 'mt_conq', icon: '🏔', name: 'Mountain Conqueror', desc: 'Reached Level 3', check: (s) => s.level >= 3 },
  { id: 'isl_hop', icon: '🏝', name: 'Island Hopper', desc: 'Earned 5 fast-answer bonuses', check: (s, r) => r && r.fastAnswers >= 5 },
  { id: 'cap_gen', icon: '🏛', name: 'Capital Genius', desc: 'Got a perfect score (10/10)', check: (s, r) => r && r.correct === 10 },
  { id: 'glob_schol', icon: '🏆', name: 'Global Scholar', desc: 'Reached Level 6', check: (s) => s.level >= 6 },
  { id: 'atl_leg', icon: '👑', name: 'Atlas Legend', desc: 'Filled 50% of your Passport', check: (s) => (Object.keys(s.stamps || {}).length / Object.keys(COUNTRY_DATA).length) >= 0.5 }
];

export const LEVELS = [
  { name: 'Explorer', xp: 0 },
  { name: 'Adventurer', xp: 1000 },
  { name: 'Navigator', xp: 3000 },
  { name: 'Cartographer', xp: 6000 },
  { name: 'World Traveler', xp: 10000 },
  { name: 'Global Scholar', xp: 15000 }
];
