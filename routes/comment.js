const express = require("express");
const router  = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require("../models/comment");
const middleware = require("../middleware");
const { isLoggedIn, checkUserComment } = middleware;

//Comments New
router.get("/new", isLoggedIn, function(req, res){
    // find campground by id
    console.log(req.params.id);
    Post.findById(req.params.id, function(err, post){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {post: post});
        }
    })
});

//Comments Create
router.post("/", isLoggedIn, function(req, res){
   //lookup campground using ID
   Post.findById(req.params.id, function(err, post){
       if(err){
           console.log(err);
           res.redirect("/blog");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               post.comments.push(comment);
               post.save();
               console.log(comment);
            //   req.flash('success', 'Created a comment!');
               res.redirect('/blog/' + post._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", isLoggedIn, checkUserComment, function(req, res){
  res.render("comments/edit", {post_id: req.params.id, comment: req.comment});
});

router.put("/:commentId", isLoggedIn, checkUserComment, function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/blog/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId", isLoggedIn, checkUserComment, function(req, res){
  // find campground, remove comment from comments array, delete comment in db
  Post.findByIdAndUpdate(req.params.id, {
    $pull: {
      comments: req.comment.id
    }
  }, function(err) {
    if(err){ 
        console.log(err)
        req.flash('error', "Whoops! " + err.message + ".");
        res.redirect('/');
    } else {
        req.comment.remove(function(err) {
          if(err) {
            req.flash('error', "Whoops! " + err.message + ".");
            return res.redirect('/');
          }
          req.flash('success', 'Successfully Deleted Comment.');
          res.redirect("/blog/" + req.params.id);
        });
    }
  });
});

module.exports = router;