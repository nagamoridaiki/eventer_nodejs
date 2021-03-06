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
router.get('/edit/:id', usersController.verifyJWT, eventsController.edit);
router.post('/update/:id', usersController.verifyJWT, eventsController.update, eventsController.tagUpdate);
router.get('/delete/:id', usersController.verifyJWT, eventsController.delete);
router.post('/join', usersController.verifyJWT, eventsController.join);


module.exports = router;