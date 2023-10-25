const { post } = require('../../marketData/livePrice');
const Post = require('../../models/Post/posts');

// Create a new contact
exports.createPost = async (req, res) => {
    // console.log(req.body)
    let {post, postedBy} = req.body;
    try {
        const post1 = await Post.create({post: post, postedBy: postedBy});
        const totalCount = await Post.countDocuments();
        res.status(201).json({status:'success', message:'Posted Successfully', count:totalCount});
    } catch (error) {
        console.log('error', error);
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

// Get all Posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({_id:-1})
        .populate('postedBy','first_name last_name profilePhoto');
        res.status(201).json({status:'success', data:posts, count:posts.length});
    } catch (error) {
        console.log(error)
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};

// exports.getPosts = async (req, res) => {
//     try {
//       const page = req.query.page || 1;
//       const perPage = 10;
//       const skip = (page - 1) * perPage;
//       const posts = await Post.find()
//         .sort({ _id: -1 })
//         .populate('postedBy', 'first_name last_name profilePhoto')
//         .skip(skip)
//         .limit(perPage);
//       const totalCount = await Post.countDocuments();
//       res.status(200).json({ status: 'success', data: posts, count:totalCount, message: 'Successful' })
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ status: 'error', message: 'Something went wrong.' });
//     }
//   };
  
  

// Get contact by id
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({status:'error', message:'No contact info found.'});
        }
        res.status(200).json({status:'success', data:post});
    } catch (error) {
        res.status(500).json({status:'error', message:'Something went wrong.'});
    }
};
