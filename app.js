const express        = require("express"),
      app            = express(),
      bodyParser     = require("body-parser"),
      mongoose       = require("mongoose"),
      passport       = require("passport"),
      cookieParser   = require("cookie-parser"),
      LocalStrategy  = require("passport-local"),
      flash          = require("connect-flash"),
      session        = require("express-session"),
      methodOverride = require("method-override"),
      User           = require("./models/user"),
      mysql          = require("mysql"),
      hooverData     = require("./sri_db");
      
// REQUIRING ROUTES
var indexRoutes   = require("./routes/index"),
    blogRoutes    = require("./routes/blog"),
    commentRoutes = require("./routes/comment"),
    labRoutes     = require("./routes/labs"),
    dataRoutes    = require("./routes/data");

// ASSIGN MONGOOSE PROMISE LIBRARY AND CONNECT TO DB
mongoose.Promise = global.Promise;

// mongoose.connect("mongodb://localhost/enviro_labs", { useNewUrlParser: true })
//     .then(() => console.log(`Database connected`))
//     .catch(err => console.log(`Database connection error: ${err.message}`));

mongoose.connect("mongodb+srv://srienvirolabs:Alabama_stem_2019!@cluster0-fcfqg.mongodb.net/test?retryWrites=true", { useNewUrlParser: true })
    .then(() => console.log(`Database connected`))
    .catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
//require moment
app.locals.moment = require('moment');

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "We are creating this application for high school stem classes!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.db = hooverData;
  next();
});

app.use("/", indexRoutes);
app.use("/blog", blogRoutes);
app.use("/blog/:id/comments", commentRoutes);
app.use("/labs", labRoutes);
app.use("/data", dataRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The SRIEnviroLabs Server Has Started!");
});