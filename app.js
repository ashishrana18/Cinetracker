const express = require("express");
const app = express();
const path = require('path');
var figlet = require("figlet");
const { v4: uuidv4 } = require('uuid');
const methodOverride=require("method-override");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {isLoggedIn} = require("./middleware.js");
const userRouter = require("./routes/user.js");

app.set("view engine","ejs");
app.engine("ejs",ejsMate);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

let port=3000;
app.listen(port,()=>{
  console.log(`app is listening on ${port}`);
})

let mov=[{
    name:"Tenet",
    genre:"sci-fi",
    src:"https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p17758177_v_h8_ad.jpg",
    rating:4.5,
    director:"Christopher Nolan",
    selectedYear:"2014",
    description:"nbfsa"
},{
    name:"interstellar",
    genre:"sci-fi",
    rating:4.5,
    src:"https://www.hollywoodreporter.com/wp-content/uploads/2014/11/interstellar_tout.jpg?w=3000",
    description:"kasfbkls"
},{
    name:"One-Piece",
    genre:"sci-fi",
    rating:4.5,
    src:"https://m.media-amazon.com/images/M/MV5BMDE1NDY2ZGEtNmY1ZC00YWZmLTk2OWMtN2IxZjhkN2FiNGMxXkEyXkFqcGdeQWplZmZscA@@._V1_.jpg",
    description:"kasfbkls"
},{
    name:"inter",
    genre:"sci-fi",
    rating:4.5,
    src:"https://www.brandsynario.com/wp-content/uploads/2020/08/tribune.1-1.jpg",
    description:"kasfbkls"
},{
    name:"Qala",
    genre:"sci-fi",
    rating:4.5,
    src:"https://www.dexerto.com/cdn-cgi/image/width=3840,quality=75,format=auto/https://editors.dexerto.com/wp-content/uploads/2021/09/08/when-is-demon-slayer-season-2-coming-out-release-date-plot-more.jpg",
    description:"kasfbkls"
},{
    name:"Pokemon",
    genre:"sci-fi",
    rating:4.5,
    src:"https://i.pinimg.com/originals/13/69/7c/13697cfdebd9792782b61b08acf6bf33.jpg",
    description:"kasfbkls"
}]

main().catch(err => console.log(err));

async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/moviesDatabase');
  await mongoose.connect('mongodb+srv://ashishrana1805:iknh7A07Yc1Z7yyw@cluster0.kuxpgui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

const movieData = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        maxLength:50
    },
    genre:{
        type:String,
        required:true
    },
    src:{
        type:String,
        required:true
    },
    rating:{
        type:Number
        // required:true
    },
    director:{
        type:String,
    },
    selectedYear:{
        type:String,
    },
    description:{
        type:String,
        required:true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Movie = mongoose.model("Movie",movieData);
// Movie.insertMany(mov);

const store = MongoStore.create({
    mongoUrl: 'mongodb+srv://ashishrana1805:iknh7A07Yc1Z7yyw@cluster0.kuxpgui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    crypto:{
        secret:"keyboard"
    },
    touchAfter:24*3600
})
store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",error);
})

app.use(session({
        store,
        secret:"keyboard",
        resave:false,
        saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }}
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

app.use("/",userRouter);

//tympass
app.get("/",(req,res,next)=>{
    // req.flash("success","new movie added");
    res.redirect("/movies");
})

// home route
app.get("/movies",async (req,res,next)=>{
    console.log("successful request");
    try{
        let movies;
        if (req.isAuthenticated()) {
            movies = await Movie.find();
        } else {
            movies = await Movie.find();
        }
        res.render("index.ejs", { movies, currentUser: req.user });
    }catch(err){
        next(err);
    }
});

app.get("/movies/new",isLoggedIn,(req,res)=>{
    res.render("form.ejs");
})

// post request
app.post('/movies',isLoggedIn, async (req, res,next) => {
    const currentUser = req.user;
    console.log(currentUser);
    try{
        const { name, director, rating, selectedYear, src, genre, description } = req.body;
        // to make 1st char capital
        let movieName=name;
        movieName = movieName.charAt(0).toUpperCase() + movieName.slice(1);
        const newMovie = new Movie({
      name: movieName,
      director: director,
      rating: rating,
      selectedYear: selectedYear,
      src: src,
      genre: genre,
      description: description,
      addedBy: currentUser._id
        });
        // Save the new movie
        await newMovie.save();

        // Associate the new movie with the current user
        currentUser.movies.push(newMovie._id); // Assuming `currentUser` contains the currently logged-in user
        await currentUser.save();
        
        req.flash("success","New movie added!");
        res.redirect("/movies");
    }catch(err){
        console.log(err.name);
        next(err);
    }
    // try {
    // 
    //   } catch (error) {
    //     // Check for duplicate key error
    //     if (error.code === 11000 && error.keyPattern && error.keyPattern.name) {
    //         // alert("keep movie name unique");
    //         return res.render("error.ejs");
    //     }
    
    //     // Handle other errors
    //     console.error(error);
    //     res.status(500).send("Internal server error.");
    //   }
});

//search
app.get("/movies/search", async (req, res) => {
    const { query } = req.query;
    // Implement logic to fetch movies based on the search criteria
    let movies = await Movie.find({
        $or: [
            { name: { $regex: query, $options: "i" } },
            { director: { $regex: query, $options: "i" } },
            { genre: { $regex: query, $options: "i" } },
            { selectedYear: { $regex: query, $options: "i" } }
        ],
    });
    res.json({ movies });
});

//sort
app.get('/movies/sortByRating', async (req, res) => {
    try {
      const movies = await Movie.find().sort({ rating: -1 });
      res.json({ movies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

//details
app.get("/movies/:id",async (req,res,next)=>{
    let {id}=req.params;
    try{
        let movie= await Movie.findById(id);
        if(!movie){
            req.flash("error","Movie you requested for doesn't exist");
            res.redirect("/movies");
        }
        res.render("details.ejs",{movie});
    }catch(err){
        console.log(err.message);
        next(err);
    }
})

//edit
app.get("/movies/:id/edit",isLoggedIn,async (req,res,next)=>{
    let {id}=req.params;
    try{
        let movie=await Movie.findById(id);
        if(!movie){
            req.flash("error","Movie you requested for doesn't exist");
            res.redirect("/movies");
        }
        // Check if the logged-in user owns the movie
        if (!movie.addedBy.equals(req.user._id)) {
            req.flash("error", "You are not authorized to edit this movie");
            return res.redirect("/movies");
        }
        res.render("edit.ejs", { movie });
    }catch(err){
        next(err);
    }
})
app.patch("/movies/:id",isLoggedIn,async (req,res,next)=>{
    let {id}=req.params;
    try{
        let {newRating,newDesc} = req.body;
        // console.log(newContent);
        let movie=await Movie.findByIdAndUpdate(id,{rating:newRating,description:newDesc},{runValidators:true});
        req.flash("success","Movie's details edited!");
        res.redirect("/userMovies");
    }catch{
        console.log(err.message);
        next(err);
    }
})

//delete
app.delete("/movies/:id",isLoggedIn,async(req,res,next)=>{
    try{
        let {id}=req.params;
        let movie = await Movie.findById(id);
        console.log(movie);
        if (movie && movie.addedBy.equals(req.user._id)) {
            await Movie.findByIdAndDelete(id);
            req.flash("success", "Movie deleted!");
        } else {
            req.flash("error", "You are not authorized to delete this movie");
        }
        res.redirect("/userMovies");
    }catch(err){
        next(err);
    }
})

app.get("/userMovies",isLoggedIn,async(req,res,next)=>{
    let currentUser=req.user;
    console.log(currentUser);
    try{
        let movies;
        if (Array.isArray(currentUser.movies)) {
            movies = await Movie.find({ _id: { $in: currentUser.movies } });
        }
        // else {
        //     movies = [];
        // }
        res.render("userMovies.ejs",{movies});
    }catch(err){
        next(err);
    }
})

// error handling middleware
app.use((err,req,res,next)=>{
    res.render("error.ejs",{err});
})
