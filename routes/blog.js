const express    = require("express"),
      router     = express.Router(),
      Post       = require("../models/post"),
      middleware = require("../middleware");
      
const { isLoggedIn, checkUserPost } = middleware;
      
// ALL BLOGS
router.get("/", function(req, res) {
    Post.find({}, function(err, allPosts) {
        if(err) {
            console.log(err);
        } else {
            res.render("blog/index", {posts: allPosts, page: 'blog'})
        }
    });
});

// NEW BLOG FORM
router.get("/new", isLoggedIn, function(req, res) {
    res.render("blog/new", {page: 'blog'})
});

// NEW BLOG POST
router.post("/", isLoggedIn, function(req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var body = req.body.post;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newPost = {title: title, description: description, body: body, author: author};
    Post.create(newPost, function(err, newBlog) {
        if(err) {
            console.log(err);
        } else {
            console.log(newBlog);
            res.redirect("/blog")
        }
    })
});

// SHOW BLOG
router.get("/:id", function(req, res) {
    Post.findById(req.params.id).populate("comments").exec(function(err, foundBlog) {
        if(err || !foundBlog) {
            req.flash("Whoops! Blog post not found.");
            res.redirect("/blogs");
        } else {
            // console.log(foundBlog.body);
            res.render("blog/show", {post: foundBlog, page: 'blog'});
        }
    });
})

// EDIT BLOG
router.get("/:id/edit", isLoggedIn, checkUserPost, function(req, res){
    console.log(req.post._id);
  //render edit template with that campground
  res.render("blog/edit", {post: req.post, page: 'blog'});
});

router.put("/:id", isLoggedIn, checkUserPost, function(req, res){
   var newData = {title: req.body.title, description: req.body.description, body: req.body.post}
   Post.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, post){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           req.flash("success","Successfully Updated Blog Post.");
           res.redirect("/blog/" + req.params.id);
       }
   }); 
});

// DELETE - removes blog post and its comments from the database
router.delete("/:id", isLoggedIn, checkUserPost, function(req, res) {
    Post.remove({
      _id: {
        $in: req.post.comments
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          req.post.remove(function(err) {
            if(err) {
                req.flash('error', "Whoops! " + err.message + ".");
                return res.redirect('/');
            }
            req.flash('success', 'Successfully Deleted Blog Post.');
            res.redirect('/blog');
          });
      }
    });
});

module.exports = router;