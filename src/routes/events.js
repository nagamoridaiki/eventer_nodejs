const express = require('express');
const { use } = require('../app');
const router = express.Router();
const usersController = require('../controllers/usersController');
const eventsController = require('../controllers/eventsController');
const multer = require('multer')


router.get('/', usersController.verifyJWT, eventsController.index);
router.get('/add', usersController.verifyJWT, eventsController.add);
router.post('/add', usersController.verifyJWT, eventsController.create);
router.get('/show/:id', usersController.verifyJWT, eventsController.show);
router.post('/join', usersController.verifyJWT, eventsController.join);


module.exports = router;