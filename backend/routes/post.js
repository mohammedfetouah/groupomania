const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, postCtrl.getAllPost);
router.post('/', multer, auth,  postCtrl.createPost);
router.get('/:name', auth, postCtrl.getOnePost);
router.put('/:id',  multer, auth, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/:id/commentaires', auth, postCtrl.getPostCommentaires);

module.exports = router;