const router = require("express").Router();
// const {
//   getUsers,
//   getSingleUser,
//   createUser,
//   deleteUser,
//   addAssignment,
//   removeAssignment,
// } = require('../../controllers/userController');

// // /api/users
// router.route('/').get(getUsers).post(createUser);

// // /api/users/:userId
// router.route('/:userId').get(getSingleUser).delete(deleteUser);

// // /api/users/:userId/assignments
// router.route('/:userId/assignments').post(addAssignment);

// // /api/users/:userId/assignments/:assignmentId
// router.route('/:userId/assignments/:assignmentId').delete(removeAssignment);

const { User, Thought } = require("../../models");

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("thoughts").populate("friends");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single user by its _id and populated thought and friend data
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("thoughts")
      .populate("friends");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT to update a user by its _id
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("thoughts")
      .populate("friends");
    if (!updatedUser)
      return res.status(404).json({ message: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE to remove user by its _id
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // BONUS: Remove associated thoughts
    await Thought.deleteMany({ _id: { $in: user.thoughts } });

    res.json({ message: "User and associated thoughts deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to add a new friend to a user's friend list
router.post("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const friend = await User.findById(req.params.friendId);
    if (!friend) return res.status(404).json({ message: "Friend not found" });

    if (user.friends.includes(friend._id))
      return res.status(400).json({ message: "Friend already in the list" });

    user.friends.push(friend._id);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE to remove a friend from a user's friend list
router.delete("/:userId/friends/:friendId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.friends.includes(req.params.friendId))
      return res.status(400).json({ message: "Friend not in the list" });

    user.friends.pull(req.params.friendId);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
