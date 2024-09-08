const router = require("express").Router();
// const {
//   getCourses,
//   getSingleCourse,
//   createCourse,
//   updateCourse,
//   deleteCourse,
// } = require('../../controllers/courseController.js');

// // /api/courses
// router.route('/').get(getCourses).post(createCourse);

// // /api/courses/:courseId
// router
//   .route('/:courseId')
//   .get(getSingleCourse)
//   .put(updateCourse)
//   .delete(deleteCourse);

const { User, Thought } = require("../../models");

// GET all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single thought by its _id
router.get("/:id", async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id);
    if (!thought) return res.status(404).json({ message: "Thought not found" });
    res.json(thought);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a new thought
router.post("/", async (req, res) => {
  try {
    const { thoughtText, username, userId } = req.body;

    // Create the new thought
    const newThought = await Thought.create({
      thoughtText,
      username,
      createdAt: new Date(),
    });

    // Update the associated user's thoughts array
    await User.findByIdAndUpdate(userId, {
      $push: { thoughts: newThought._id },
    });

    res.status(201).json(newThought);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT to update a thought by its _id
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

// DELETE to remove a thought by its _id
router.delete("/:id", async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) return res.status(404).json({ message: "Thought not found" });

    // Remove thought from associated user's thoughts array
    await User.updateMany(
      { thoughts: thought._id },
      { $pull: { thoughts: thought._id } }
    );

    res.json({ message: "Thought deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST to create a reaction stored in a single thought's reactions array field
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const { reactionBody, username } = req.body;

    // Add reaction to the thought's reactions array
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

// DELETE to pull and remove a reaction by the reaction's reactionId value
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
