const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  Users.insert(req.body)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot add user.', error: err})
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // do your magic!
  req.newPost.user_id = req.params.id;
  Posts.insert(req.newPost)
    .then(recordsAdded => {
      res.status(201).json(recordsAdded);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot add post to user.', error: err})
    })
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(users => {
      res.status(200).json({users});
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot get users.', error: err})
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const {id} = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot get users posts.', error: err})
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(recordsAdded => {
      res.status(204).json(recordsAdded);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot delete user.', error: err})
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const changes = req.body;
  Users.update(req.user.id, changes)
    .then(recordsChanged => {
      res.status(200).json(recordsChanged);
    })
    .catch(err => {
      res.status(500).json({message: 'Internal Server error. Cannot update user.', error: err})
    })
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const {id} = req.params;
  Users.getById(id)
    .then(user => {
      if(user) {
        req.user = user;
        next();
      } else {
        res.status(400).json({message: 'invalid user id'});
      }
    })
}

function validateUser(req, res, next) {
  // do your magic!
  let bodyCount = Object.keys(req.body);
  if(bodyCount.length < 1) {
    res.status(400).json({ message: "missing user data" });
  } else if(!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // do your magic!
  let bodyCount = Object.keys(req.body);
  if(bodyCount < 1) {
    res.status(400).json({ message: "missing post data" });
  } else if(!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    req.newPost = {
      text: req.body.text,
    }
    next();
  }
}

module.exports = router;
