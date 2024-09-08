const router = require('express').Router();
const courseRoutes = require('./courseRoutes');
const userRoutes = require('./userRoutes');

router.use('/courses', courseRoutes);
router.use('/users', userRoutes);

module.exports = router;
