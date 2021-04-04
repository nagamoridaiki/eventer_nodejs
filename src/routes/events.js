const express = require('express');
const { use } = require('../app');
const router = express.Router();
const usersController = require('../controllers/usersController');
const eventsController = require('../controllers/eventsController');
const multer = require('multer')


router.get('/add', usersController.verifyJWT, eventsController.add);
router.post('/add', usersController.verifyJWT, eventsController.create);


module.exports = router;