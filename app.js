var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    User        = require("./models/user");
    
//requiring routes
var courseRoutes     = require("./routes/courses"),
    indexRoutes      = require("./routes/index")
    
// mongoose.connect("mongodb://localhost/collabo_v1", { useMongoClient: true });
mongoose.connect("mongodb://Joe:projectM90@collabo-db-shard-00-00-htm2b.gcp.mongodb.net:27017,collabo-db-shard-00-01-htm2b.gcp.mongodb.net:27017,collabo-db-shard-00-02-htm2b.gcp.mongodb.net:27017/test?ssl=true&replicaSet=collabo-db-shard-0&authSource=admin&retryWrites=true");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/courses", courseRoutes);


app.listen(process.env.PORT || 3000, function(){
   console.log("The Collabo Server Has Started!");
});