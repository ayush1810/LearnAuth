var express = require("express"),
        app = express(),
        User = require("./models/user"),
        mongoose = require("mongoose"),
        passport = require("passport"),
        bodyParser = require ("body-parser"),
        LocalStrategy = require("passport-local"),
        passportLocalMongoose = require("passport-local-mongoose");

mongoose.connect("mongodb://localhost/auth_demo_app", { useMongoClient: true});
app.use(require("express-session")({
    secret: "Trying out Authentication",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==================
//ROUTES
//==================

app.get("/", function (req, res){
    res.render("home");
}) ;

app.get("/secret", function(req,res){
        res.render("secret");
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err)
        {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/secret");
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", {
    successRedirect : "/secret",
    failureRedirect : "/login"
}) , function(req, res){
});

app.listen(3000, function(){
    console.log("Server has started. ");
})
