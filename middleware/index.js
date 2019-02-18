var Course = require("../models/course");

// all the middleare goes here
var middlewareObj = {};

middlewareObj.checkCourseOwnership = function(req, res, next) {
 if(req.isAuthenticated()){
        Course.findById(req.params.id, function(err, foundCourse){
           if(err){
               req.flash("error", "Course not found");
               res.redirect("back");
           }  else {
               // does user own the course?
            if(foundCourse.author.id.equals(req.user._id)) {
                next();
            } else {
                req.flash("error", "You don't have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;