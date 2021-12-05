const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');




router.get('/', postCtrl.getAllPost);
router.post('/',multer, postCtrl.createPost);
router.get('/:id',postCtrl.getOnePost);
router.put('/:id',multer, postCtrl.modifyPost);
router.delete('/:id',postCtrl.deletePost);

module.exports = router;