const router = require("express").Router();

const { User, Thought } = require("../../models");

router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ message: "Thought not found" });
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    const newThought = await Thought.create({
      thoughtText,
      username,
      createdAt: new Date(),
    });

    await User.findByIdAndUpdate(userId, {
      $push: { thoughts: newThought._id },
    });

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedThought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedThought)
      return res.status(404).json({ message: "Thought not found" });
    res.json(updatedThought);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) return res.status(404).json({ message: "Thought not found" });

    await User.updateMany(
      { thoughts: thought._id },
      { $pull: { thoughts: thought._id } }
    );

    res.json({ message: "Thought deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const { reactionBody, username } = req.body;

    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      {
        $push: { reactions: { reactionBody, username, createdAt: new Date() } },
      },
      { new: true, runValidators: true }
    );
    if (!thought) return res.status(404).json({ message: "Thought not found" });

    res.json(thought);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true }
    );
    if (!thought) return res.status(404).json({ message: "Thought not found" });

    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
