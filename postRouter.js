const router = require('express').Router()
const BlogPosts = require('./data/db.js');

//POST
router.post('/', (req, res) => {
    if (req.body.title && req.body.contents) {
        //these handle the 200 and 500 status we can put logic within the .then,.catch and outside it
        BlogPosts.insert(req.body)
            .then(post => {
                // res.status(201).json(post);
                BlogPosts.findById(post.id)
                    .then(finalPost => {
                        if (finalPost) {
                            res.status(201).json(finalPost);
                        } else {
                            res.status(500).json({
                                message: 'There was an error while saving the post to the database'
                            });
                        }
                    })
                    .catch(error => {
                        // log error to database
                        console.log(error);
                        res.status(500).json({
                            message: 'There was an error while saving the post to the database',
                        });
                    });
            })
            .catch(error => {
                // log error to database
                console.log(error);
                res.status(500).json({
                    message: "There was an error while saving the post to the database",
                });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
});

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    let currentPosts = [];
    let newPost = {
        post_id: id,
        text: req.body.text
    }
    if (newPost.text) {
        BlogPosts.find()
            .then(post => {
                currentPosts = post
                // console.log(currentPosts)
                if (id <= currentPosts.length && id >= 0) {
                    BlogPosts.insertComment(newPost)
                        .then(post => {
                            // res.status(200).json(post);
                            BlogPosts.findCommentById(post.id)
                                .then(comment => {
                                    if (comment) {
                                        res.status(200).json(comment);
                                    } else {
                                        res.status(404).json({ 
                                            message: 'There was an error while saving the comment to the database' 
                                        });
                                    }
                                })
                                .catch(error => {
                                    // log error to database
                                    console.log(error);
                                    res.status(500).json({
                                        message: 'There was an error while saving the comment to the database',
                                    });
                                });
                        })
                        .catch(error => {
                            // log error to database
                            console.log(error);
                            res.status(500).json({
                                message: "There was an error while saving the comment to the database",
                            });
                        })
                } else {
                    res.status(400).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(error => {
                // log error to database
                console.log(error);
                res.status(500).json({
                    message: 'There was an error while saving the comment to the database',
                });
            });

    } else {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    }
});

//GET
router.get('/', (req, res) => {
    BlogPosts.find()
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'post not found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the post',
            });
        });
});

router.get('/:id', (req, res) => {
    BlogPosts.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: 'post not found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the post',
            });
        });
});

router.get('/:id/comments', (req, res) => {
    BlogPosts.findPostComments(req.params.id)
        .then(comment => {
            if (comment) {
                res.status(200).json(comment);
            } else {
                res.status(404).json({ message: 'comment not found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error retrieving the hub',
            });
        });
});

//DELETE AND PUT
router.delete('/:id', (req, res) => {
    BlogPosts.remove(req.params.id)
        .then(count => {
            if (count > 0) {
                res.status(200).json({ message: 'The post has been nuked' });
            } else {
                res.status(404).json({ message: 'The post could not be found' });
            }
        })
        .catch(error => {
            // log error to database
            console.log(error);
            res.status(500).json({
                message: 'Error removing the post',
            });
        });
});

router.put('/:id', (req, res) => {
    const changes = req.body;

    if (req.body.title && req.body.contents) {
        BlogPosts.update(req.params.id, changes)
            .then(post => {
                if (post) {
                    BlogPosts.findById(req.params.id)
                        .then(finalPost => {
                            if (finalPost) {
                                res.status(200).json(finalPost);
                            } else {
                                res.status(500).json({ message: 'Error retrieving the post' });
                            }
                        })
                        .catch(error => {
                            // log error to database
                            console.log(error);
                            res.status(500).json({
                                message: 'Error retrieving the post',
                            });
                        });
                } else {
                    res.status(404).json({ message: 'The post could not be found' });
                }
            })
            .catch(error => {
                // log error to database
                console.log(error);
                res.status(500).json({
                    message: 'Error updating the post',
                });
            });
    } else {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
});

module.exports = router;