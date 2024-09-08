const connection = require('../config/connection');
const { Course, User } = require('../models');
const { getRandomName, getRandomCourses } = require('./data');

connection.on('error', (err) => err);

connection.once('open', async () => {
  console.log('connected');
    // Delete the collections if they exist
    let courseCheck = await connection.db.listCollections({ name: 'courses' }).toArray();
    if (courseCheck.length) {
      await connection.dropCollection('courses');
    }

    let usersCheck = await connection.db.listCollections({ name: 'users' }).toArray();
    if (usersCheck.length) {
      await connection.dropCollection('users');
    }


  // Create empty array to hold the users
  const users = [];

  // Loop 20 times -- add users to the users array
  for (let i = 0; i < 20; i++) {
    // Get some random assignment objects using a helper function that we imported from ./data
    // const assignments = getRandomAssignments(20);

    const names = getRandomName();
    const fname = names.split('')[0];
    const lname = names.split(' ')[1];
    const email = names.split(' ')[2];
    users.push({
      fname,
      lname,
      email
    });
  }

  // Add users to the collection and await the results
  const userData = await User.create(users);
  console.table(users);

  const courses = getRandomCourses();

  console.table(courses);

  // Add courses to the collection and await the results
  // const courseData = await Course.create(courses
  //   // courseName: getRandomCourses(courseName),
  //   // description: getRandomCourses(description),
  //   // users: [...userData.map(({_id}) => _id)],
  // );

  // Log out the seed data to indicate what should appear in the database
  
  // console.table(courseData)
  console.info('Seeding complete! 🌱');
  process.exit(0);
});
