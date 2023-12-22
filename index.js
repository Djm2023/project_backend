// Importing Modules for initialisation.
const express = require("express");
const dotEnv = require("dotenv").config({ path: "./config.env" });
const PORT = process.env.PORT;
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const session = require("express-session");
const User = require("./models/userSchema");
const app = express();
const db = require("./config/dataBase");
// Set up session
const passportJWT = require("./config/passport-jwt");

app.use(express.urlencoded());
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Set up Passport with Facebook strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:8000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    (accessToken, refreshToken, profile, done) => {
      // Save user information in the session
      return done(null, profile);
    }
  )
);

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Route for Facebook authentication
// app.get("/auth/facebook", passport.authenticate("facebook"));

// // Callback route after Facebook has authenticated the user
// app.get(
//   "/auth/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })
// );

// Route to check if the user is authenticated
// app.get("/", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send(
//       `<p>Hello, ${req.user.displayName}! ${req.user.email}</p><a href="/logout">Logout</a>`
//     );
//   } else {
//     res.send(
//       '<p>Please <a href="/auth/facebook">log in with Facebook</a>.</p>'
//     );
//   }
// });

// // Logout route
// app.get("/logout", (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.log("Error in loggingout");
//     } else {
//       res.redirect("/");
//     }
//   });
// });

// Start the server
app.use("/", require("./routes/index"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
