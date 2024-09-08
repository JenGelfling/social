const fnames = [
 "John",
"Jane",
"Michael",
"Emily",
"Chris",
"Jessica",
"David",
"Sarah",
"Robert",
"Laura",
"Daniel",
"Megan",
"James"
];

const lnames = [
"Doe",
"Smith",
"Johnson",
"Davis",
"Brown",
"Wilson",
"Taylor",
"Anderson",
"Thomas",
"Martinez",
"Garcia",
"Hernandez",
"Moore"
 ];


 const emails = [
"john.doe@example.com",
"jane.smith@example.com",
"michael.johnson@example.com",
"emily.davis@example.com",
"chris.brown@example.com",
"jessica.wilson@example.com",
"david.taylor@example.com",
"sarah.anderson@example.com",
"robert.thomas@example.com",
"laura.martinez@example.com" ,
"daniel.garcia@example.com",
"megan.hernandez@example.com",
"james.moore@example.com",
 ];

 const course = [
  'Course 1',
  'Course 2',
  'Course 3',
  'Course 4',
  'Course 5',
  'Course 6',
  'Course 7',
  'Course 8',
  'Course 9',
  'Course 10',
  'Course 11',
  'Course 12',
  'Course 13',
  'Firefox',
  'Running app',
  'Cooking app',
  'Poker',
  'Deliveries',
];

const courseDescription = [
  'Decision Tracker',
  'Find My Phone',
  'Learn Piano',
  'Starbase Defender',
  'Tower Defense',
  'Monopoly Money Manager',
  'Movie trailers',
  'Hello world',
  'Stupid Social Media App',
  'Notes',
  'Messages',
  'Email',
  'Compass',
  'Firefox',
  'Running app',
  'Cooking app',
  'Poker',
  'Deliveries',
];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomName = () =>
  `${getRandomArrItem(fnames)} ${getRandomArrItem(lnames)} ${getRandomArrItem(emails)}`;

// Function to generate random assignments that we can add to user object.
const getRandomCourses = () => {
  const results = [];
  for (let i = 0; i < 20; i++) {
    results.push({
      courseName: getRandomArrItem(course),
      description: getRandomArrItem(courseDescription)
    });
  }
  return results;
};

// Export the functions for use in seed.js
module.exports = { getRandomName, getRandomCourses };
