var express = require("express");
var router  = express.Router();
var Course = require("../models/course");
var middleware = require("../middleware");


//INDEX - show all courses
router.get("/", function(req, res){
    // Get all courses from DB
    Course.find({}, function(err, allCourses){
       if(err){
           console.log(err);
       } else {
          res.render("courses/index",{courses:allCourses});
       }
    });
});

//CREATE - add new course to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to courses array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCourse = {name: name, image: image, description: desc, author:author}
    // Create a new course and save to DB
    Course.create(newCourse, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to courses page
            console.log(newlyCreated);
            res.redirect("/courses");
        }
    });
});

//NEW - show form to create new course
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("courses/new"); 
});

// SHOW - shows more info about one course
router.get("/:id", function(req, res){
    //find the course with provided ID
    Course.findById(req.params.id).exec(function(err, foundCourse){
        if(err){
            console.log(err);
        } else {
            console.log(foundCourse)
            //render show template with that course
            res.render("courses/show", {course: foundCourse});
        }
    });
});

// EDIT COURSE ROUTE
router.get("/:id/edit", middleware.checkCourseOwnership, function(req, res){
    Course.findById(req.params.id, function(err, foundCourse){
        res.render("courses/edit", {course: foundCourse});
    });
});

// UPDATE COURSE ROUTE
router.put("/:id",middleware.checkCourseOwnership, function(req, res){
    // find and update the correct course
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, updatedCourse){
       if(err){
           res.redirect("/courses");
       } else {
           //redirect somewhere(show page)
           res.redirect("/courses/" + req.params.id);
       }
    });
});

// DESTROY COURSE ROUTE
router.delete("/:id",middleware.checkCourseOwnership, function(req, res){
   Course.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/courses");
      } else {
          res.redirect("/courses");
      }
   });
});


module.exports = router;

