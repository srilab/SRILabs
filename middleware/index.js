const Post = require("../models/post");

module.exports = {
  isLoggedIn: function(req, res, next){
      if(req.isAuthenticated()){
          return next();
      }
      req.flash('error', 'Whoops! You must be logged in to do that.');
      res.redirect('/login');
  },
  checkUserPost: function(req, res, next) {
    console.log(req.params.id);
    Post.findById(req.params.id, function(err, foundBlog) {
      if(err || !foundBlog) {
        console.log(err);
          req.flash('error', 'Whoops! Blog post not found.');
          res.redirect('/blog');
      } else if(foundBlog.author.id.equals(req.user._id)) {
        req.post = foundBlog;
        next();
      } else {
        req.flash('error', 'Whoops! You do not have permission to do that.');
        res.redirect('/blog/' + req.params.id);
      }
    });
  }
}