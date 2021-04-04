const express = require('express');
const { use } = require('../app');
const router = express.Router();
const usersController = require('../controllers/usersController');
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/')
    },
    filename: function(req, file, cb) {
        cb(null, 'image.jpg')
    }
})
const upload = multer({ storage: storage })

router.get('/login', usersController.login);
router.get('/register', usersController.register);
router.post('/create', usersController.create, usersController.indexView);

router.post('/login', usersController.apiAuthenticate, usersController.index, usersController.indexView);
router.post('/delete/', usersController.verifyJWT, usersController.delete, usersController.indexView);


router.get('/', usersController.verifyJWT, usersController.index, usersController.indexView);
router.get('/logout', usersController.logout)
router.get('/user/:id', usersController.verifyJWT, usersController.myProf);


//router.post('/image', usersController.verifyJWT, usersController.imagePost);

router.post('/image', upload.single('file'), function(req, res) {
    res.send('ファイルのアップロードが完了しました。');
})



module.exports = router;