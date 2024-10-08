const router = require("express").Router();

const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("thoughts").populate("friends");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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

router.post("/", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("thoughts");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const thoughtIds = user.thoughts.map((thought) => thought._id);

    await Thought.deleteMany({ _id: { $in: thoughtIds } });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: "User and associated thoughts deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

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
