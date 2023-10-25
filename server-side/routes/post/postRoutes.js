const express = require('express');
const Authenticate = require('../../authentication/authentication');
const {createPost, getPost, getPosts} = require('../../controllers/posts/postController');
const router = express.Router();

router.post('/',Authenticate, createPost)
router.get('/posts', getPosts);
router.get('/:id',Authenticate, getPost);

module.exports = router;
