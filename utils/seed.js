const mongoose = require("mongoose");
const { User, Thought } = require("../models");

const users = [
  {
    username: "alice",
    email: "alice@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "bob",
    email: "bob@example.com",
    thoughts: [],
    friends: [],
  },
  {
    username: "carol",
    email: "carol@example.com",
    thoughts: [],
    friends: [],
  },
];

const thoughts = [
  {
    thoughtText: "I love programming!",
    username: "alice",
    createdAt: new Date(),
  },
  {
    thoughtText: "MongoDB is awesome!",
    username: "bob",
    createdAt: new Date(),
  },
  {
    thoughtText: "Express makes routing easy!",
    username: "carol",
    createdAt: new Date(),
  },
];

const friendsData = [
  {
    user: "alice",
    friends: ["bob", "carol"],
  },
  {
    user: "bob",
    friends: ["alice"],
  },
  {
    user: "carol",
    friends: ["alice"],
  },
];

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect("mongodb://localhost:27017/socialDB");

    console.log("Connected to database");

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Insert new users
    const insertedUsers = await User.insertMany(users);

    // Map usernames to their respective ObjectIds
    const userMap = new Map();
    insertedUsers.forEach((user) => userMap.set(user.username, user._id));

    // Prepare thoughts with userIds
    const updatedThoughts = thoughts.map((thought) => ({
      ...thought,
      // No need for userId in thoughts, use username for reference
    }));

    // Insert thoughts
    const insertedThoughts = await Thought.insertMany(updatedThoughts);

    // Update users with thought references
    for (let user of insertedUsers) {
      const userThoughts = insertedThoughts
        .filter((thought) => thought.username === user.username)
        .map((thought) => thought._id);
      await User.findByIdAndUpdate(user._id, { thoughts: userThoughts });
    }

    // Add friends
    for (const { user, friends } of friendsData) {
      const userId = userMap.get(user);
      const friendIds = friends.map((friend) => userMap.get(friend));
      await User.findByIdAndUpdate(userId, { friends: friendIds });
    }

    console.log("Seed data inserted successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error seeding data:", err);
    mongoose.connection.close();
  }
};

seedDB();
