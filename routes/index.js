const express = require("express");
const router = express.Router();
const passport = require("passport");

// Router for users
router.use("/user", require("./user"));

// Route for Facebook authentication.
router.get("/auth/facebook", passport.authenticate("facebook"));

// Callback route after Facebook has authenticated the user
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

// Route to check if the user is authenticated
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<p>Hello, ${req.user.displayName}!</p><a href="/logout">Logout</a>`
    );
  } else {
    res.send(
      '<p>Please <a href="/auth/facebook">log in with Facebook</a>.</p>'
    );
  }
});

// Logout route
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("Error in loggingout");
    } else {
      res.redirect("/");
    }
  });
});

module.exports = router;
